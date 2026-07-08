import { escapeHtml } from "@/lib/security/escape-html";
import { BRAND_NAME, CONTACT } from "@/lib/site";
import { formatCurrency } from "@/lib/utils";
import { sendEmail } from "@/lib/email/send";

type QuoteEmailData = {
  quoteNumber: string;
  businessName: string;
  contactName: string;
  email: string;
  projectSummary: string;
  recommendedSolution: string;
  deliverables: string[];
  estimatedTimeline: string;
  priceEstimate: number;
  terms: string;
};

export async function sendQuoteEmail(
  quote: QuoteEmailData,
  pdfBuffer: Buffer,
): Promise<{ ok: boolean; error?: string }> {
  const safe = {
    quoteNumber: escapeHtml(quote.quoteNumber),
    businessName: escapeHtml(quote.businessName),
    contactName: escapeHtml(quote.contactName),
    projectSummary: escapeHtml(quote.projectSummary),
    estimatedTimeline: escapeHtml(quote.estimatedTimeline),
    deliverables: quote.deliverables.map((d) => escapeHtml(d)),
  };

  const deliverablesHtml = safe.deliverables.map((d) => `<li>${d}</li>`).join("");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; color: #111;">
      <p style="color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em;">${BRAND_NAME} Proposal</p>
      <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 8px;">Hi ${safe.contactName},</h1>
      <p style="color: #444; line-height: 1.6;">Thank you for speaking with our AI assistant. Your project quotation <strong>${safe.quoteNumber}</strong> for <strong>${safe.businessName}</strong> is attached.</p>
      <div style="background: #f7f7f7; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0 0 4px; color: #666; font-size: 13px;">Estimated investment</p>
        <p style="margin: 0; font-size: 28px; font-weight: 700;">${formatCurrency(quote.priceEstimate)}</p>
        <p style="margin: 8px 0 0; color: #666; font-size: 14px;">Timeline: ${safe.estimatedTimeline}</p>
      </div>
      <h2 style="font-size: 16px; margin-bottom: 8px;">Project summary</h2>
      <p style="color: #444; line-height: 1.6;">${safe.projectSummary}</p>
      <h2 style="font-size: 16px; margin-bottom: 8px;">Deliverables</h2>
      <ul style="color: #444; line-height: 1.8; padding-left: 20px;">${deliverablesHtml}</ul>
      <p style="color: #444; line-height: 1.6; margin-top: 24px;">Ready to move forward? Reply to this email or book a free consultation at ${process.env.NEXT_PUBLIC_SITE_URL}/book</p>
      <p style="color: #888; font-size: 13px; margin-top: 32px;">${BRAND_NAME} · ${CONTACT.email} · ${CONTACT.phone}</p>
    </div>
  `;

  const result = await sendEmail({
    to: quote.email,
    subject: `${quote.quoteNumber} · Your ${BRAND_NAME} Project Proposal`,
    html,
    text: `Your quote ${quote.quoteNumber} from ${BRAND_NAME}. Estimated: ${formatCurrency(quote.priceEstimate)}. See attached PDF.`,
    attachments: [
      {
        filename: `${quote.quoteNumber}.pdf`,
        content: pdfBuffer,
      },
    ],
  });

  if (!result.ok) return { ok: false, error: result.error };

  await sendEmail({
    to: CONTACT.email,
    subject: `New quote generated: ${quote.quoteNumber}`,
    html: `<p>New quote <strong>${safe.quoteNumber}</strong> for ${safe.businessName} (${escapeHtml(quote.email)}): ${formatCurrency(quote.priceEstimate)}</p>`,
  });

  return { ok: true };
}

export async function sendBookingConfirmation(input: {
  name: string;
  email: string;
  scheduledAt: string;
  company?: string;
}) {
  const safeName = escapeHtml(input.name);
  const safeCompany = input.company ? escapeHtml(input.company) : undefined;

  const when = new Intl.DateTimeFormat("en-ZA", {
    weekday: "long",
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Africa/Johannesburg",
  }).format(new Date(input.scheduledAt));

  return sendEmail({
    to: input.email,
    subject: `Consultation confirmed · ${BRAND_NAME}`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px;">
        <h1 style="font-size: 22px;">You're booked, ${safeName}</h1>
        <p>Your free consultation with ${BRAND_NAME} is confirmed for:</p>
        <p style="font-size: 18px; font-weight: 600;">${escapeHtml(when)}</p>
        <p>We'll send a calendar invite shortly. If you need to reschedule, reply to this email.</p>
        ${safeCompany ? `<p style="color: #666;">Company: ${safeCompany}</p>` : ""}
      </div>
    `,
  });
}
