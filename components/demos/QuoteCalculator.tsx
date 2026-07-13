"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Bot, ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/data/services";
import {
  getCarePlansForService,
  type CarePlanTierId,
} from "@/lib/data/care-plans";
import { Button } from "@/components/ui";
import { formatCurrency, cn } from "@/lib/utils";
import { DemoShell } from "@/components/demos/DemoShell";

const SIZE_BANDS = [
  { id: "solo", label: "1 to 10", multiplier: 1 },
  { id: "mid", label: "11 to 50", multiplier: 1.2 },
  { id: "large", label: "51+", multiplier: 1.45 },
] as const;

const URGENCY = [
  { id: "standard", label: "Standard", multiplier: 1 },
  { id: "rush", label: "Rush", multiplier: 1.25 },
] as const;

type Extra = { id: string; label: string; amount: number };

const EXTRAS: Extra[] = [
  { id: "whatsapp", label: "WhatsApp channel", amount: 12000 },
  { id: "cms", label: "CMS training", amount: 8000 },
  { id: "support", label: "90-day support", amount: 15000 },
];

type CareSelection = "none" | CarePlanTierId;

export function QuoteCalculator({
  compact,
  lockServiceSlug,
}: {
  compact?: boolean;
  lockServiceSlug?: string;
}) {
  const initial =
    SERVICES.find((s) => s.slug === lockServiceSlug) ?? SERVICES[0];
  const [serviceSlug, setServiceSlug] = useState(initial.slug);
  const service = SERVICES.find((s) => s.slug === serviceSlug) ?? SERVICES[0];
  const [packageName, setPackageName] = useState(
    service.packages.find((p) => p.highlighted)?.name ?? service.packages[0].name,
  );
  const [sizeId, setSizeId] = useState<(typeof SIZE_BANDS)[number]["id"]>("mid");
  const [urgencyId, setUrgencyId] = useState<(typeof URGENCY)[number]["id"]>("standard");
  const [extras, setExtras] = useState<string[]>([]);
  const [careTier, setCareTier] = useState<CareSelection>("none");

  const carePlans = getCarePlansForService(service.slug);
  const selectedPackage =
    service.packages.find((p) => p.name === packageName) ?? service.packages[0];
  const size = SIZE_BANDS.find((s) => s.id === sizeId)!;
  const urgency = URGENCY.find((u) => u.id === urgencyId)!;
  const selectedCare =
    careTier === "none"
      ? null
      : (carePlans.find((p) => p.id === careTier) ?? null);

  const estimate = useMemo(() => {
    const base = selectedPackage.price;
    const sizeAdj = Math.round(base * (size.multiplier - 1));
    const rushAdj = Math.round((base + sizeAdj) * (urgency.multiplier - 1));
    const extrasTotal = EXTRAS.filter((e) => extras.includes(e.id)).reduce(
      (sum, e) => sum + e.amount,
      0,
    );
    const total = base + sizeAdj + rushAdj + extrasTotal;
    return {
      base,
      sizeAdj,
      rushAdj,
      extrasTotal,
      total,
      careMonthly: selectedCare?.monthlyPrice ?? 0,
      timeline:
        urgency.id === "rush"
          ? selectedPackage.timeline.replace(/(\d+) to (\d+)/, (_, a, b) => {
              const start = Math.max(1, Number(a) - 1);
              const end = Math.max(start + 1, Number(b) - 1);
              return `${start} to ${end}`;
            })
          : selectedPackage.timeline,
    };
  }, [selectedPackage, size, urgency, extras, selectedCare]);

  function onServiceChange(slug: string) {
    setServiceSlug(slug);
    const next = SERVICES.find((s) => s.slug === slug)!;
    setPackageName(next.packages.find((p) => p.highlighted)?.name ?? next.packages[0].name);
    setCareTier("none");
  }

  function toggleExtra(id: string) {
    setExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <DemoShell title="LuvaTech · Quote Engine" compact={compact}>
      <div className={cn("grid gap-5", compact ? "lg:grid-cols-1" : "lg:grid-cols-2")}>
        <div className="space-y-4">
          {!lockServiceSlug && (
            <div>
              <label className="text-xs uppercase tracking-wider text-white/40">Service</label>
              <select
                value={serviceSlug}
                onChange={(e) => onServiceChange(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm outline-none focus:border-accent/50"
                suppressHydrationWarning
              >
                {SERVICES.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs uppercase tracking-wider text-white/40">Package</label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {service.packages.map((pkg) => (
                <button
                  key={pkg.name}
                  type="button"
                  onClick={() => setPackageName(pkg.name)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs transition-colors",
                    packageName === pkg.name
                      ? "border-accent bg-accent/10 text-white"
                      : "border-white/10 text-white/50 hover:border-white/25",
                  )}
                >
                  {pkg.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-white/40">Company size</label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {SIZE_BANDS.map((band) => (
                <button
                  key={band.id}
                  type="button"
                  onClick={() => setSizeId(band.id)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs transition-colors",
                    sizeId === band.id
                      ? "border-accent bg-accent/10 text-white"
                      : "border-white/10 text-white/50 hover:border-white/25",
                  )}
                >
                  {band.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-white/40">Timeline</label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {URGENCY.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setUrgencyId(u.id)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs transition-colors",
                    urgencyId === u.id
                      ? "border-accent bg-accent/10 text-white"
                      : "border-white/10 text-white/50 hover:border-white/25",
                  )}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          {carePlans.length > 0 && (
            <div>
              <label className="text-xs uppercase tracking-wider text-white/40">
                Care plan
              </label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCareTier("none")}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs transition-colors",
                    careTier === "none"
                      ? "border-accent bg-accent/10 text-white"
                      : "border-white/10 text-white/50 hover:border-white/25",
                  )}
                >
                  None
                </button>
                {carePlans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setCareTier(plan.id)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs transition-colors",
                      careTier === plan.id
                        ? "border-accent bg-accent/10 text-white"
                        : "border-white/10 text-white/50 hover:border-white/25",
                    )}
                  >
                    {plan.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs uppercase tracking-wider text-white/40">Extras</label>
            <div className="mt-1.5 space-y-2">
              {EXTRAS.map((extra) => (
                <label
                  key={extra.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 hover:border-white/20"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={extras.includes(extra.id)}
                      onChange={() => toggleExtra(extra.id)}
                      className="accent-[var(--accent)]"
                    />
                    {extra.label}
                  </span>
                  <span className="text-xs text-white/35">+{formatCurrency(extra.amount)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="text-xs uppercase tracking-wider text-white/40">Build estimate</p>
          <p
            key={estimate.total}
            className="mt-2 font-display text-3xl font-semibold text-accent transition-opacity"
          >
            {formatCurrency(estimate.total)}
          </p>
          <p className="mt-1 text-xs text-white/40">Timeline {estimate.timeline}</p>

          {estimate.careMonthly > 0 && selectedCare && (
            <div className="mt-3 rounded-lg border border-accent/20 bg-accent/[0.06] px-3 py-2">
              <p className="text-xs text-white/45">{selectedCare.name} care</p>
              <p className="font-display text-lg font-semibold text-white">
                {formatCurrency(estimate.careMonthly)}
                <span className="ml-1 text-sm font-normal text-white/40">/mo</span>
              </p>
            </div>
          )}

          <div className="mt-4 space-y-1.5 border-t border-white/[0.06] pt-3 text-xs text-white/45">
            <div className="flex justify-between">
              <span>{selectedPackage.name} package</span>
              <span>{formatCurrency(estimate.base)}</span>
            </div>
            {estimate.sizeAdj > 0 && (
              <div className="flex justify-between">
                <span>Team size adjustment</span>
                <span>+{formatCurrency(estimate.sizeAdj)}</span>
              </div>
            )}
            {estimate.rushAdj > 0 && (
              <div className="flex justify-between">
                <span>Rush delivery</span>
                <span>+{formatCurrency(estimate.rushAdj)}</span>
              </div>
            )}
            {estimate.extrasTotal > 0 && (
              <div className="flex justify-between">
                <span>Extras</span>
                <span>+{formatCurrency(estimate.extrasTotal)}</span>
              </div>
            )}
            {estimate.careMonthly > 0 && selectedCare && (
              <div className="flex justify-between text-accent/80">
                <span>{selectedCare.name} care (monthly)</span>
                <span>{formatCurrency(estimate.careMonthly)}/mo</span>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => window.dispatchEvent(new CustomEvent("open-ai-assistant"))}
            >
              <Bot className="h-4 w-4" />
              Formal quote
            </Button>
            <Link href="/book" className="flex-1">
              <Button size="sm" variant="secondary" className="w-full">
                Book Demo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-3 text-[11px] text-white/30">
            Demo estimate only. Formal quotes are generated by the AI assistant.
            Care plans are optional and billed monthly after launch.
          </p>
        </div>
      </div>
    </DemoShell>
  );
}
