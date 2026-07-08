"use client";

import { QuoteCalculator } from "@/components/demos/QuoteCalculator";
import { PipelineBoard } from "@/components/demos/PipelineBoard";
import { BookingSimulator } from "@/components/demos/BookingSimulator";
import { ClientOnly } from "@/components/demos/ClientOnly";

const QUOTE_SLUGS = new Set([
  "website-development",
  "quotation-systems",
  "ai-chatbots",
]);

const PIPELINE_SLUGS = new Set([
  "crm-systems",
  "internal-dashboards",
  "business-automation",
]);

const BOOKING_SLUGS = new Set(["appointment-systems"]);

export function ServiceDemoEmbed({ slug }: { slug: string }) {
  if (QUOTE_SLUGS.has(slug)) {
    return (
      <section className="mt-16">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Try it</h2>
        <p className="mt-2 text-sm text-white/50">
          Build a rough estimate. Open the AI assistant for a formal quote.
        </p>
        <div className="mt-8">
          <ClientOnly fallback={<div className="h-[360px] animate-pulse rounded-2xl border border-white/10 bg-[#080b0f]" />}>
            <QuoteCalculator lockServiceSlug={slug} />
          </ClientOnly>
        </div>
      </section>
    );
  }

  if (PIPELINE_SLUGS.has(slug)) {
    return (
      <section className="mt-16">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Move a deal</h2>
        <p className="mt-2 text-sm text-white/50">
          Drag cards across stages. This is the CRM density we ship for operations teams.
        </p>
        <div className="mt-8">
          <ClientOnly fallback={<div className="h-[360px] animate-pulse rounded-2xl border border-white/10 bg-[#080b0f]" />}>
            <PipelineBoard />
          </ClientOnly>
        </div>
      </section>
    );
  }

  if (BOOKING_SLUGS.has(slug)) {
    return (
      <section className="mt-16">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Pick a slot</h2>
        <p className="mt-2 text-sm text-white/50">
          Hold a demo time on the page. Book for real when you are ready.
        </p>
        <div className="mt-8">
          <ClientOnly fallback={<div className="h-[360px] animate-pulse rounded-2xl border border-white/10 bg-[#080b0f]" />}>
            <BookingSimulator />
          </ClientOnly>
        </div>
      </section>
    );
  }

  return null;
}
