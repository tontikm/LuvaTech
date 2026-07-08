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
import { calculateQuoteEstimate } from "@/lib/quotes/pricing";
import { sendBookingConfirmation, sendQuoteEmail } from "@/lib/email/templates";
import { renderQuotationPdf } from "@/lib/pdf/render";
import { SERVICES } from "@/lib/data/services";
import { BRAND_NAME, CONTACT } from "@/lib/site";
import { formatCurrency } from "@/lib/utils";
import { isValidFutureSlot } from "@/lib/booking/slots";

export const maxDuration = 60;

const quoteInputSchema = z.object({
  businessName: z.string(),
  contactName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  industry: z.string(),
  employees: z.number().optional(),
  websiteNeeds: z.string().optional(),
  automationNeeds: z.string(),
  budgetRange: z.string(),
  timeline: z.string(),
});

const tools = {
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
      const lead = await createLead({ ...input, source: "chatbot" });
      const { quote, estimate } = await generateAndSaveQuote(input, lead.id);

      const quoteData = {
        quoteNumber: "quoteNumber" in quote ? quote.quoteNumber : (quote as { quoteNumber: string }).quoteNumber,
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
    inputSchema: z.object({
      name: z.string(),
      email: z.string().email(),
      company: z.string().optional(),
      date: z.string().describe("YYYY-MM-DD"),
      time: z.string().describe("HH:MM 24h format"),
      notes: z.string().optional(),
      quoteNumber: z.string().optional(),
    }),
    execute: async (input) => {
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

      return {
        success: true,
        bookingId: "id" in booking ? booking.id : (booking as { id: string }).id,
        scheduledAt,
        message: `Consultation confirmed for ${input.date} at ${input.time}. Confirmation email sent to ${input.email}.`,
      };
    },
  }),
};

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "AI assistant is not configured. Set OPENAI_API_KEY." }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  const body = await req.json();
  const { messages, sessionId }: { messages: UIMessage[]; sessionId?: string } = body;

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
- After generating a quote, offer to book a free consultation using getAvailableSlots and bookConsultation
- Be conversational, professional, and concise. Avoid sounding salesy. Do not use em dashes in replies.

Services: business automation, CRM systems, internal dashboards, websites, appointment systems, quotation systems, API integrations, cloud solutions, and AI chatbots.

Pricing is in ZAR. Quotes are estimates subject to discovery workshop.
Contact: ${CONTACT.email} | ${CONTACT.phone}

Always collect: business name, contact name, email, industry, automation/website needs, budget range, and timeline before generating a formal quote.`,
    messages: await convertToModelMessages(messages, { tools }),
    tools,
    stopWhen: stepCountIs(8),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
