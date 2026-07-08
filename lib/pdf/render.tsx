import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { QuotationPdfDocument, type QuotationPdfProps } from "@/lib/pdf/quotation";

export async function renderQuotationPdf(props: QuotationPdfProps): Promise<Buffer> {
  const doc = <QuotationPdfDocument {...props} />;
  const buffer = await renderToBuffer(doc);
  return Buffer.from(buffer);
}
