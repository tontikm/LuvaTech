import { NextResponse } from "next/server";
import { z } from "zod";
import { createLead, generateAndSaveQuote } from "@/lib/db/queries";
import { sendQuoteEmail } from "@/lib/email/templates";
import { renderQuotationPdf } from "@/lib/pdf/render";

const quoteSchema = z.object({
  businessName: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  industry: z.string().min(2),
  employees: z.number().optional(),
  websiteNeeds: z.string().optional(),
  automationNeeds: z.string().min(10),
  budgetRange: z.string().min(2),
  timeline: z.string().min(2),
});

export async function POST(req: Request) {
  try {
    const input = quoteSchema.parse(await req.json());
    const lead = await createLead({ ...input, source: "form" });
    const { quote, estimate } = await generateAndSaveQuote(input, lead.id);

    const quoteNumber =
      "quoteNumber" in quote ? quote.quoteNumber : (quote as { quoteNumber: string }).quoteNumber;

    const quoteData = {
      quoteNumber,
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

    await sendQuoteEmail(quoteData, pdfBuffer);

    return NextResponse.json({ ok: true, quoteNumber, estimate });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Quote generation failed" }, { status: 500 });
  }
}
