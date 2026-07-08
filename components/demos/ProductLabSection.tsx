"use client";

import { useState } from "react";
import { Calendar, Columns3, Calculator } from "lucide-react";
import { QuoteCalculator } from "@/components/demos/QuoteCalculator";
import { PipelineBoard } from "@/components/demos/PipelineBoard";
import { BookingSimulator } from "@/components/demos/BookingSimulator";
import { ClientOnly } from "@/components/demos/ClientOnly";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "quote", label: "Quote", icon: Calculator },
  { id: "pipeline", label: "Pipeline", icon: Columns3 },
  { id: "booking", label: "Booking", icon: Calendar },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ProductLabSection() {
  const [tab, setTab] = useState<TabId>("quote");

  return (
    <section className="border-t border-white/[0.06] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-accent">
            Product lab
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Touch these. This is the caliber of UI we ship.
          </h2>
          <p className="mt-4 max-w-xl text-white/50 leading-relaxed">
            Live quote math, a CRM pipeline you can drag, and a booking hold simulator. The same
            class of product craft goes into every client build.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                tab === item.id
                  ? "border-accent bg-accent/10 text-white"
                  : "border-white/10 text-white/50 hover:border-white/25 hover:text-white",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <ClientOnly
            fallback={
              <div className="h-[420px] animate-pulse rounded-2xl border border-white/10 bg-[#080b0f]" />
            }
          >
            {tab === "quote" && <QuoteCalculator />}
            {tab === "pipeline" && <PipelineBoard />}
            {tab === "booking" && <BookingSimulator />}
          </ClientOnly>
        </div>
      </div>
    </section>
  );
}
