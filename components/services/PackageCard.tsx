"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import {
  PACKAGE_TIERS,
  type PackageTier,
  type ServicePackage,
} from "@/lib/data/services";
import { Button, cn } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

const TIER_STYLES: Record<
  PackageTier,
  {
    border: string;
    bg: string;
    glow: string;
    check: string;
    badge: string;
    button: string;
  }
> = {
  amber: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/[0.04]",
    glow: "hover:border-amber-400/50 hover:shadow-[0_20px_50px_-20px_rgba(245,158,11,0.35)]",
    check: "text-amber-400 group-hover:text-amber-300",
    badge: "text-amber-400",
    button: "group-hover:border-amber-400/30 group-hover:bg-amber-500/10",
  },
  sky: {
    border: "border-sky-500/30",
    bg: "bg-sky-500/[0.04]",
    glow: "hover:border-sky-400/50 hover:shadow-[0_20px_50px_-20px_rgba(56,189,248,0.35)]",
    check: "text-sky-400 group-hover:text-sky-300",
    badge: "text-sky-400",
    button: "group-hover:border-sky-400/30 group-hover:bg-sky-500/10",
  },
  teal: {
    border: "border-accent/40",
    bg: "bg-accent/[0.04]",
    glow: "hover:border-accent/60 hover:shadow-[0_20px_50px_-20px_rgba(45,212,191,0.4)]",
    check: "text-accent group-hover:text-accent",
    badge: "text-accent",
    button: "group-hover:border-accent/40 group-hover:bg-accent/10",
  },
  violet: {
    border: "border-violet-500/30",
    bg: "bg-violet-500/[0.04]",
    glow: "hover:border-violet-400/50 hover:shadow-[0_20px_50px_-20px_rgba(167,139,250,0.35)]",
    check: "text-violet-400 group-hover:text-violet-300",
    badge: "text-violet-400",
    button: "group-hover:border-violet-400/30 group-hover:bg-violet-500/10",
  },
  rose: {
    border: "border-rose-500/30",
    bg: "bg-rose-500/[0.04]",
    glow: "hover:border-rose-400/50 hover:shadow-[0_20px_50px_-20px_rgba(251,113,133,0.35)]",
    check: "text-rose-400 group-hover:text-rose-300",
    badge: "text-rose-400",
    button: "group-hover:border-rose-400/30 group-hover:bg-rose-500/10",
  },
};

function resolveTier(pkg: ServicePackage, index: number): PackageTier {
  return pkg.tier ?? PACKAGE_TIERS[index % PACKAGE_TIERS.length];
}

type PackageCardProps = {
  pkg: ServicePackage;
  index: number;
};

export function PackageCard({ pkg, index }: PackageCardProps) {
  const tier = resolveTier(pkg, index);
  const styles = TIER_STYLES[tier];

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl",
        "transition-all duration-300 motion-safe:hover:-translate-y-1",
        pkg.highlighted && [styles.border, styles.bg],
        styles.glow,
      )}
    >
      {pkg.highlighted && (
        <p
          className={cn(
            "mb-3 text-xs font-medium uppercase tracking-wider",
            styles.badge,
          )}
        >
          Most popular
        </p>
      )}
      <h3 className="font-display text-lg font-medium transition-colors group-hover:text-white">
        {pkg.name}
      </h3>
      <p className="mt-1 text-sm text-white/45 transition-colors group-hover:text-white/55">
        {pkg.description}
      </p>
      <p className="mt-4 font-display text-2xl font-semibold">{formatCurrency(pkg.price)}</p>
      <p className="mt-1 text-xs text-white/40">{pkg.timeline}</p>
      <ul className="mt-5 flex-1 space-y-2">
        {pkg.includes.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-white/60">
            <Check className={cn("mt-0.5 h-4 w-4 shrink-0 transition-colors", styles.check)} />
            {item}
          </li>
        ))}
      </ul>
      <Link href="/book" className="mt-6 block">
        <Button
          size="sm"
          variant={pkg.highlighted ? "primary" : "secondary"}
          className={cn("w-full transition-all duration-300", !pkg.highlighted && styles.button)}
        >
          Book Demo
        </Button>
      </Link>
    </div>
  );
}
