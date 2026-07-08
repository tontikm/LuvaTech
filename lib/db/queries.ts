import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import {
  localCreateBooking,
  localCreateLead,
  localCreateQuote,
  localGetDashboardStats,
  localTrackEvent,
  localUpsertConversation,
  type StoredBooking,
  type StoredLead,
  type StoredQuote,
} from "@/lib/db/local-store";
import {
  calculateQuoteEstimate,
  nextQuoteNumber,
  type QuoteEstimate,
  type QuoteInput,
} from "@/lib/quotes/pricing";

export async function createLead(input: QuoteInput & { source?: string }) {
  if (!isDatabaseConfigured()) {
    return localCreateLead(input);
  }

  return prisma.lead.create({
    data: {
      businessName: input.businessName,
      contactName: input.contactName,
      email: input.email,
      phone: input.phone,
      industry: input.industry,
      employees: input.employees,
      source: input.source ?? "website",
    },
  });
}

export async function createQuoteRecord(
  input: QuoteInput,
  estimate: QuoteEstimate,
  leadId?: string,
): Promise<StoredQuote | Awaited<ReturnType<typeof prisma.quote.create>>> {
  if (!isDatabaseConfigured()) {
    return localCreateQuote(input, estimate, leadId);
  }

  const count = await prisma.quote.count();
  return prisma.quote.create({
    data: {
      quoteNumber: nextQuoteNumber(count),
      leadId,
      businessName: input.businessName,
      contactName: input.contactName,
      email: input.email,
      industry: input.industry,
      employees: input.employees,
      websiteNeeds: input.websiteNeeds,
      automationNeeds: input.automationNeeds,
      budgetRange: input.budgetRange,
      timeline: input.timeline,
      projectSummary: estimate.projectSummary,
      recommendedSolution: estimate.recommendedSolution,
      deliverables: estimate.deliverables,
      estimatedTimeline: estimate.estimatedTimeline,
      priceEstimate: estimate.priceEstimate,
      terms: estimate.terms,
    },
  });
}

export async function generateAndSaveQuote(input: QuoteInput, leadId?: string) {
  const estimate = calculateQuoteEstimate(input);
  const quote = await createQuoteRecord(input, estimate, leadId);
  return { quote, estimate };
}

export async function createBooking(input: {
  name: string;
  email: string;
  company?: string;
  scheduledAt: string;
  notes?: string;
  quoteId?: string;
  leadId?: string;
}) {
  if (!isDatabaseConfigured()) {
    return localCreateBooking(input);
  }

  return prisma.booking.create({
    data: {
      name: input.name,
      email: input.email,
      company: input.company,
      scheduledAt: new Date(input.scheduledAt),
      notes: input.notes,
      quoteId: input.quoteId,
      leadId: input.leadId,
    },
  });
}

export async function saveConversation(
  sessionId: string,
  messages: unknown[],
  leadId?: string,
) {
  if (!isDatabaseConfigured()) {
    return localUpsertConversation(sessionId, messages, leadId);
  }

  return prisma.conversation.upsert({
    where: { sessionId },
    create: { sessionId, messages: messages as Prisma.InputJsonValue, leadId },
    update: { messages: messages as Prisma.InputJsonValue, leadId },
  });
}

export async function trackEvent(input: {
  type: string;
  path?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}) {
  if (!isDatabaseConfigured()) {
    localTrackEvent(input);
    return;
  }

  await prisma.analyticsEvent.create({
    data: {
      type: input.type,
      path: input.path,
      sessionId: input.sessionId,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
    },
  });
}

export async function getDashboardData() {
  if (!isDatabaseConfigured()) {
    return localGetDashboardStats();
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [leads, quotes, bookings, conversations, analytics] = await Promise.all([
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.quote.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.booking.findMany({
      where: { scheduledAt: { gte: now }, status: "CONFIRMED" },
      orderBy: { scheduledAt: "asc" },
      take: 20,
    }),
    prisma.conversation.findMany({ orderBy: { updatedAt: "desc" }, take: 30 }),
    prisma.analyticsEvent.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
  ]);

  const newLeadsThisWeek = await prisma.lead.count({
    where: { createdAt: { gte: weekAgo } },
  });
  const quotesThisWeek = await prisma.quote.count({
    where: { createdAt: { gte: weekAgo } },
  });
  const pageViews = await prisma.analyticsEvent.count({ where: { type: "page_view" } });
  const chatStarts = await prisma.analyticsEvent.count({ where: { type: "chat_start" } });
  const quoteRequests = await prisma.quote.count();

  return {
    leads,
    quotes,
    bookings,
    conversations,
    analytics,
    stats: {
      newLeadsThisWeek,
      quotesThisWeek,
      upcomingMeetings: bookings.length,
      pageViews,
      chatStarts,
      quoteRequests,
      conversionRate: chatStarts > 0 ? Math.round((quoteRequests / chatStarts) * 100) : 0,
    },
    upcomingBookings: bookings,
  };
}

export function getAvailableSlots(days = 14): Array<{ date: string; slots: string[] }> {
  const result: Array<{ date: string; slots: string[] }> = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  for (let d = 1; d <= days; d++) {
    const day = new Date(start);
    day.setDate(start.getDate() + d);
    const dow = day.getDay();
    if (dow === 0 || dow === 6) continue;

    const dateStr = day.toISOString().slice(0, 10);
    const slots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
    result.push({ date: dateStr, slots });
  }

  return result;
}

export type { StoredLead, StoredQuote, StoredBooking, QuoteInput, QuoteEstimate };
