import {
  getCarePlanOption,
  getManagedSubIncludes,
  type CarePlanTierId,
} from "@/lib/data/care-plans";
import { getService } from "@/lib/data/services";
import { formatCurrency } from "@/lib/utils";

export type QuoteInput = {
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  industry: string;
  employees?: number;
  websiteNeeds?: string;
  automationNeeds?: string;
  budgetRange: string;
  timeline: string;
};

export type QuoteCarePlan = {
  tier: CarePlanTierId;
  name: string;
  monthlyPrice: number;
  includes: string[];
  services: string[];
};

export type QuoteEstimate = {
  projectSummary: string;
  recommendedSolution: string;
  deliverables: string[];
  estimatedTimeline: string;
  /** Once-off build estimate. */
  priceEstimate: number;
  /** Managed monthly subscription estimate (Essential care included). */
  subscriptionEstimate: number;
  terms: string;
  /** Optional care for once-off ownership only. */
  carePlan: QuoteCarePlan | null;
};

const BASE_PACKAGES: Record<string, number> = {
  "website-development": 2500,
  "ai-chatbots": 5500,
  "business-automation": 6500,
  "crm-systems": 12000,
  "internal-dashboards": 8500,
  "appointment-systems": 4500,
  "quotation-systems": 5500,
  "api-integrations": 3500,
  "cloud-solutions": 2000,
};

function entryMonthlyForService(slug: string): number {
  const service = getService(slug);
  if (service?.packages[0]?.monthlyPrice) return service.packages[0].monthlyPrice;
  const onceOff = BASE_PACKAGES[slug] ?? 30000;
  return Math.max(250, Math.round(onceOff / 10 / 50) * 50);
}

function detectServices(input: QuoteInput): string[] {
  const text = `${input.websiteNeeds ?? ""} ${input.automationNeeds ?? ""}`.toLowerCase();
  const services: string[] = [];

  if (
    text.includes("website") ||
    text.includes("landing") ||
    text.includes("web app") ||
    text.includes("site")
  ) {
    services.push("website-development");
  }
  if (
    text.includes("chatbot") ||
    text.includes("assistant") ||
    text.includes("ai") ||
    text.includes("gpt")
  ) {
    services.push("ai-chatbots");
  }
  if (
    text.includes("automate") ||
    text.includes("workflow") ||
    text.includes("integration") ||
    text.includes("manual")
  ) {
    services.push("business-automation");
  }
  if (text.includes("crm") || text.includes("pipeline") || text.includes("leads")) {
    services.push("crm-systems");
  }
  if (text.includes("dashboard") || text.includes("report") || text.includes("analytics")) {
    services.push("internal-dashboards");
  }
  if (
    text.includes("book") ||
    text.includes("appointment") ||
    text.includes("schedule") ||
    text.includes("calendar")
  ) {
    services.push("appointment-systems");
  }
  if (text.includes("quote") || text.includes("proposal") || text.includes("pdf")) {
    services.push("quotation-systems");
  }
  if (text.includes("api") || text.includes("xero") || text.includes("payfast") || text.includes("shopify")) {
    services.push("api-integrations");
  }

  if (!services.length) {
    services.push("website-development", "ai-chatbots");
  }

  return [...new Set(services)];
}

function employeeMultiplier(employees?: number): number {
  if (!employees || employees <= 10) return 1;
  if (employees <= 50) return 1.25;
  if (employees <= 200) return 1.5;
  return 1.85;
}

function timelineMultiplier(timeline: string): number {
  const t = timeline.toLowerCase();
  if (t.includes("urgent") || t.includes("asap") || t.includes("2 week")) return 1.35;
  if (t.includes("1 month") || t.includes("4 week")) return 1.15;
  return 1;
}

function budgetCap(budgetRange: string): number | null {
  const match = budgetRange.match(/(\d[\d\s,]*)/g);
  if (!match) return null;
  const nums = match.map((n) => parseInt(n.replace(/\D/g, ""), 10)).filter(Boolean);
  return nums.length ? Math.max(...nums) : null;
}

/**
 * Recommend Growth care for mid/large once-off builds; otherwise Essential.
 */
function recommendCareTier(services: string[], priceEstimate: number): CarePlanTierId {
  if (services.length >= 2 || priceEstimate >= 15000) return "growth";
  return "essential";
}

function buildCarePlanRecommendation(
  services: string[],
  priceEstimate: number,
): QuoteCarePlan | null {
  if (!services.length) return null;

  const tier = recommendCareTier(services, priceEstimate);
  const priced = services
    .map((slug) => ({ slug, plan: getCarePlanOption(slug, tier) }))
    .filter(
      (row): row is { slug: string; plan: NonNullable<ReturnType<typeof getCarePlanOption>> } =>
        Boolean(row.plan),
    );

  if (!priced.length) return null;

  const monthlyPrice = priced.reduce((sum, row) => sum + row.plan.monthlyPrice, 0);
  const primary = priced[0].plan;

  return {
    tier,
    name: primary.name,
    monthlyPrice,
    includes: primary.includes,
    services: priced.map((row) => row.slug),
  };
}

function roundToThousand(n: number): number {
  return Math.round(n / 1000) * 1000;
}

function roundToFifty(n: number): number {
  return Math.round(n / 50) * 50;
}

export function calculateQuoteEstimate(input: QuoteInput): QuoteEstimate {
  const services = detectServices(input);
  const base = services.reduce((sum, slug) => sum + (BASE_PACKAGES[slug] ?? 30000), 0);
  const monthlyBase = services.reduce((sum, slug) => sum + entryMonthlyForService(slug), 0);
  const empMul = employeeMultiplier(input.employees);
  const timeMul = timelineMultiplier(input.timeline);
  let price = roundToThousand(base * empMul * timeMul);
  let subscription = Math.max(250, roundToFifty(monthlyBase * empMul * timeMul));

  const cap = budgetCap(input.budgetRange);
  if (cap && price > cap) {
    price = roundToThousand(cap * 0.92);
  }

  const serviceLabels = services.map((s) =>
    s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  );

  const deliverables = [
    "Discovery workshop and requirements document",
    "UI/UX design for key user flows",
    ...serviceLabels.map((s) => `${s}: design, build, and QA`),
    "Staging environment for client review",
    "Production deployment and handover documentation",
    "30-day post-launch support window",
  ];

  if (services.includes("ai-chatbots")) {
    deliverables.push("AI assistant trained on your business knowledge base");
  }
  if (services.includes("quotation-systems")) {
    deliverables.push("Branded PDF quote templates with email delivery");
  }

  const weeks =
    services.length >= 3 ? "8 to 12 weeks" : services.length === 2 ? "6 to 8 weeks" : "4 to 6 weeks";

  const carePlan = buildCarePlanRecommendation(services, price);
  const managedIncludes = getManagedSubIncludes().join("; ");

  const terms =
    `Once-off: 50% deposit to commence work. 30% on staging approval. 20% on production launch. Quote valid for 14 days. Scope changes documented via change request. All IP transfers on final payment.` +
    ` Managed subscription alternative: from ${formatCurrency(subscription)}/mo (billed monthly, cancel anytime) including Essential care (${managedIncludes}).` +
    (carePlan
      ? ` If choosing once-off ownership, optional ${carePlan.name} care is available from ${formatCurrency(carePlan.monthlyPrice)}/mo after launch.`
      : "");

  return {
    projectSummary: `${input.businessName} requires a modern digital system to ${input.automationNeeds?.slice(0, 120) ?? "streamline operations and capture more leads"}. Based on your ${input.industry} context and team size${input.employees ? ` of ${input.employees}` : ""}, we recommend a phased delivery starting with ${serviceLabels.slice(0, 2).join(" and ")}.`,
    recommendedSolution: `An integrated stack combining ${serviceLabels.join(", ")}, deployed on Next.js with PostgreSQL, secured authentication, and production-grade monitoring. Choose once-off ownership (${formatCurrency(price)}) or a managed monthly subscription (${formatCurrency(subscription)}/mo, Essential care included). ${input.websiteNeeds ? `Website scope: ${input.websiteNeeds.slice(0, 100)}.` : ""}`,
    deliverables,
    estimatedTimeline: input.timeline.includes("week") ? input.timeline : weeks,
    priceEstimate: price,
    subscriptionEstimate: subscription,
    terms,
    carePlan,
  };
}

export function nextQuoteNumber(existingCount: number): string {
  const year = new Date().getFullYear();
  return `LTQ-${year}-${String(existingCount + 1).padStart(4, "0")}`;
}
