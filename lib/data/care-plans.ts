export type CarePlanTierId = "essential" | "growth" | "priority";

export type CarePlanTierDef = {
  id: CarePlanTierId;
  name: string;
  positioning: string;
  includes: string[];
  highlighted?: boolean;
};

export type ServiceCarePlan = {
  tier: CarePlanTierId;
  monthlyPrice: number;
};

export type CarePlanOption = CarePlanTierDef & {
  monthlyPrice: number;
};

/** Shared tier definitions applied to every service. */
export const CARE_PLAN_TIERS: CarePlanTierDef[] = [
  {
    id: "essential",
    name: "Essential",
    positioning: "Light upkeep so your build stays healthy.",
    includes: [
      "Hosting and uptime monitoring",
      "Security and dependency updates",
      "Monthly health check-in",
      "Email support (48-hour response)",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    positioning: "Active support with room for small changes.",
    includes: [
      "Everything in Essential",
      "Up to 4 hours of tweaks / content each month",
      "Priority email support (24-hour response)",
      "Monitoring alerts and incident notice",
    ],
    highlighted: true,
  },
  {
    id: "priority",
    name: "Priority",
    positioning: "Hands-on partner for teams that move fast.",
    includes: [
      "Everything in Growth",
      "Up to 10 hours of changes each month",
      "Same-business-day response window",
      "Quarterly strategy review call",
    ],
  },
];

/**
 * Monthly ZAR prices per service, scaled by product complexity.
 * Build packages stay one-time; care is optional after launch.
 */
export const SERVICE_CARE_PRICES: Record<string, Record<CarePlanTierId, number>> = {
  "website-development": { essential: 950, growth: 2500, priority: 5500 },
  "ai-chatbots": { essential: 1500, growth: 3500, priority: 7500 },
  "business-automation": { essential: 2000, growth: 5000, priority: 9500 },
  "crm-systems": { essential: 2500, growth: 5500, priority: 10000 },
  "internal-dashboards": { essential: 1800, growth: 4500, priority: 8500 },
  "appointment-systems": { essential: 1200, growth: 3000, priority: 6500 },
  "quotation-systems": { essential: 1500, growth: 3500, priority: 7500 },
  "api-integrations": { essential: 1000, growth: 2800, priority: 6000 },
  "cloud-solutions": { essential: 850, growth: 2200, priority: 5000 },
};

export function getCarePlansForService(slug: string): CarePlanOption[] {
  const prices = SERVICE_CARE_PRICES[slug];
  if (!prices) return [];

  return CARE_PLAN_TIERS.map((tier) => ({
    ...tier,
    monthlyPrice: prices[tier.id],
  }));
}

export function getCarePlanStartingFrom(slug: string): number | null {
  const plans = getCarePlansForService(slug);
  if (!plans.length) return null;
  return Math.min(...plans.map((p) => p.monthlyPrice));
}

export function getCarePlanOption(
  slug: string,
  tier: CarePlanTierId,
): CarePlanOption | null {
  return getCarePlansForService(slug).find((p) => p.id === tier) ?? null;
}

/** Lowest Essential price across all catalogued services (for marketing copy). */
export function getGlobalCareStartingFrom(): number {
  const essentials = Object.values(SERVICE_CARE_PRICES).map((p) => p.essential);
  return Math.min(...essentials);
}
