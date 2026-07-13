"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import type { CarePlanOption } from "@/lib/data/care-plans";
import { Button, cn } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

type CarePlanCardProps = {
  plan: CarePlanOption;
};

export function CarePlanCard({ plan }: CarePlanCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl",
        "transition-all duration-300 motion-safe:hover:-translate-y-1",
        "hover:border-accent/50 hover:shadow-[0_20px_50px_-20px_rgba(45,212,191,0.35)]",
        plan.highlighted && "border-accent/40 bg-accent/[0.04]",
      )}
    >
      {plan.highlighted && (
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-accent">
          Recommended
        </p>
      )}
      <h3 className="font-display text-lg font-medium transition-colors group-hover:text-white">
        {plan.name}
      </h3>
      <p className="mt-1 text-sm text-white/45 transition-colors group-hover:text-white/55">
        {plan.positioning}
      </p>
      <p className="mt-4 font-display text-2xl font-semibold">
        {formatCurrency(plan.monthlyPrice)}
        <span className="ml-1 text-sm font-normal text-white/40">/mo</span>
      </p>
      <p className="mt-1 text-xs text-white/40">
        Once-off ownership · billed monthly · cancel anytime
      </p>
      <ul className="mt-5 flex-1 space-y-2">
        {plan.includes.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-white/60">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent transition-colors" />
            {item}
          </li>
        ))}
      </ul>
      <Link href="/book" className="mt-6 block">
        <Button
          size="sm"
          variant={plan.highlighted ? "primary" : "secondary"}
          className={cn(
            "w-full transition-all duration-300",
            !plan.highlighted &&
              "group-hover:border-accent/40 group-hover:bg-accent/10",
          )}
        >
          Book Demo
        </Button>
      </Link>
    </div>
  );
}
