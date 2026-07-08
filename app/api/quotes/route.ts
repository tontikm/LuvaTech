import { NextResponse } from "next/server";
import { z } from "zod";
import { createLead, generateAndSaveQuote } from "@/lib/db/queries";
import { sendQuoteEmail } from "@/lib/email/templates";
import { renderQuotationPdf } from "@/lib/pdf/render";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { quoteInputSchema } from "@/lib/security/schemas";

export async function POST(req: Request) {
  const rateLimited = await enforceRateLimit(req, "emailAction");
  if (rateLimited) return rateLimited;

  try {
    const input = quoteInputSchema.parse(await req.json());
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

    return NextResponse.json({ ok: true, quoteNumber });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Quote generation failed" }, { status: 500 });
  }
}
