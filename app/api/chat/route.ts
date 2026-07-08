import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  tool,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import {
  createBooking,
  createLead,
  generateAndSaveQuote,
  getAvailableSlotsForBooking,
  isSlotTaken,
  saveConversation,
} from "@/lib/db/queries";
import { SlotTakenError } from "@/lib/db/errors";
import { calculateQuoteEstimate } from "@/lib/quotes/pricing";
import { sendBookingConfirmation, sendQuoteEmail } from "@/lib/email/templates";
import { renderQuotationPdf } from "@/lib/pdf/render";
import { SERVICES } from "@/lib/data/services";
import { BRAND_NAME, CONTACT } from "@/lib/site";
import { formatCurrency } from "@/lib/utils";
import { isValidFutureSlot } from "@/lib/booking/slots";
import { checkActionLimit, recordAction } from "@/lib/security/action-limits";
import { enforceRateLimit, extractClientIp } from "@/lib/security/rate-limit";
import { chatBodySchema, quoteInputSchema, bookConsultationSchema } from "@/lib/security/schemas";

export const maxDuration = 60;

type ChatToolContext = {
  ip: string;
  sessionId?: string;
  userEmails: Set<string>;
};

function extractUserEmails(messages: UIMessage[]): Set<string> {
  const emails = new Set<string>();
  const pattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  for (const message of messages) {
    if (message.role !== "user") continue;
    const text = message.parts
      .filter((part) => part.type === "text")
      .map((part) => ("text" in part ? part.text : ""))
      .join(" ");
    for (const match of text.matchAll(pattern)) {
      emails.add(match[0].toLowerCase());
    }
  }

  return emails;
}

function emailConfirmedInChat(email: string, userEmails: Set<string>): boolean {
  return userEmails.has(email.toLowerCase());
}

function createChatTools(ctx: ChatToolContext) {
  return {
    listServices: tool({
      description: "List LuvaTech services with starting prices",
      inputSchema: z.object({}),
      execute: async () =>
        SERVICES.map((s) => ({
          title: s.title,
          slug: s.slug,
          startingFrom: formatCurrency(s.startingFrom),
          timeline: s.timeline,
          headline: s.headline,
        })),
    }),
    estimatePricing: tool({
      description: "Calculate a rough project estimate before formal quote",
      inputSchema: quoteInputSchema,
      execute: async (input) => {
        const estimate = calculateQuoteEstimate(input);
        return {
          priceEstimate: formatCurrency(estimate.priceEstimate),
          timeline: estimate.estimatedTimeline,
          deliverables: estimate.deliverables.slice(0, 5),
          note: "Formal quote can be generated once customer confirms details.",
        };
      },
    }),
    generateQuote: tool({
      description:
        "Generate a formal branded quotation PDF and email it to the customer. Use after confirming all details.",
      inputSchema: quoteInputSchema,
      execute: async (input) => {
        const limit = await checkActionLimit("quote", ctx.ip, ctx.sessionId);
        if (!limit.allowed) {
          return { success: false, message: limit.message };
        }

        if (!emailConfirmedInChat(input.email, ctx.userEmails)) {
          return {
            success: false,
            message:
              "The customer must provide their email address in the chat before a quote can be sent.",
          };
        }

        const lead = await createLead({ ...input, source: "chatbot" });
        const { quote, estimate } = await generateAndSaveQuote(input, lead.id);

        const quoteData = {
          quoteNumber:
            "quoteNumber" in quote
              ? quote.quoteNumber
              : (quote as { quoteNumber: string }).quoteNumber,
          businessName: input.businessName,
          contactName: input.contactName,
          email: input.email,
          projectSummary: estimate.projectSummary,
          recommendedSolution: estimate.recommendedSolution,
          deliverables: estimate.deliverables,
          estimatedTimeline: estimate.estimatedTimeline,
          priceEstimate: estimate.priceEstimate,
          terms: estimate.terms,
        };

        const pdfBuffer = await renderQuotationPdf({
          ...quoteData,
          industry: input.industry,
          issueDate: new Date().toLocaleDateString("en-ZA"),
        });

        const emailResult = await sendQuoteEmail(quoteData, pdfBuffer);
        await recordAction("quote", ctx.ip, ctx.sessionId);

        return {
          success: true,
          quoteNumber: quoteData.quoteNumber,
          total: formatCurrency(estimate.priceEstimate),
          timeline: estimate.estimatedTimeline,
          emailSent: emailResult.ok,
          message: `Quotation ${quoteData.quoteNumber} has been generated${emailResult.ok ? ` and emailed to ${input.email}` : ""}. Would you like to schedule a free consultation?`,
        };
      },
    }),
    getAvailableSlots: tool({
      description: "Get available consultation booking slots for the next 2 weeks",
      inputSchema: z.object({}),
      execute: async () => getAvailableSlotsForBooking(14),
    }),
    bookConsultation: tool({
      description: "Book a free consultation meeting",
      inputSchema: bookConsultationSchema,
      execute: async (input) => {
        const limit = await checkActionLimit("booking", ctx.ip, ctx.sessionId);
        if (!limit.allowed) {
          return { success: false, message: limit.message };
        }

        if (!emailConfirmedInChat(input.email, ctx.userEmails)) {
          return {
            success: false,
            message:
              "The customer must provide their email address in the chat before booking.",
          };
        }

        if (!isValidFutureSlot(input.date, input.time)) {
          return {
            success: false,
            message: "That time slot has already passed. Please choose another available slot.",
          };
        }

        if (await isSlotTaken(input.date, input.time)) {
          return {
            success: false,
            message: "That time slot is no longer available. Please choose another.",
          };
        }

        const scheduledAt = new Date(`${input.date}T${input.time}:00+02:00`).toISOString();

        try {
          const booking = await createBooking({
            name: input.name,
            email: input.email,
            company: input.company,
            scheduledAt,
            notes: input.notes,
          });

          await sendBookingConfirmation({
            name: input.name,
            email: input.email,
            scheduledAt,
            company: input.company,
          });

          await recordAction("booking", ctx.ip, ctx.sessionId);

          return {
            success: true,
            bookingId: "id" in booking ? booking.id : (booking as { id: string }).id,
            scheduledAt,
            message: `Consultation confirmed for ${input.date} at ${input.time}. Confirmation email sent to ${input.email}.`,
          };
        } catch (err) {
          if (err instanceof SlotTakenError) {
            return { success: false, message: err.message };
          }
          throw err;
        }
      },
    }),
  };
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "AI assistant is not configured. Set OPENAI_API_KEY." }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  const rateLimited = await enforceRateLimit(req, "chat");
  if (rateLimited) return rateLimited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = chatBodySchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages, sessionId } = parsed.data;
  const ip = extractClientIp(req);
  const userEmails = extractUserEmails(messages as UIMessage[]);
  const tools = createChatTools({ ip, sessionId, userEmails });

  if (sessionId && messages.length) {
    await saveConversation(sessionId, messages).catch(() => {});
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `You are the AI assistant for ${BRAND_NAME}, a business automation company that builds workflows, CRMs, dashboards, integrations, websites, and AI chatbots for companies in South Africa and internationally.

Your role:
- Explain services clearly and recommend the right combination
- Qualify leads by asking about business name, industry, team size, requirements, budget, and timeline
- Use estimatePricing for rough estimates, generateQuote only after confirming ALL details with the customer
- The customer must type their email in the chat before generateQuote or bookConsultation can succeed
- After generating a quote, offer to book a free consultation using getAvailableSlots and bookConsultation
- Be conversational, professional, and concise. Avoid sounding salesy. Do not use em dashes in replies.

Services: business automation, CRM systems, internal dashboards, websites, appointment systems, quotation systems, API integrations, cloud solutions, and AI chatbots.

Pricing is in ZAR. Quotes are estimates subject to discovery workshop.
Contact: ${CONTACT.email} | ${CONTACT.phone}

Always collect: business name, contact name, email, industry, automation/website needs, budget range, and timeline before generating a formal quote.`,
    messages: await convertToModelMessages(messages as UIMessage[], { tools }),
    tools,
    stopWhen: stepCountIs(8),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
