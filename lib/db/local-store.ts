import fs from "fs";
import path from "path";
import type { QuoteInput, QuoteEstimate } from "@/lib/quotes/pricing";
import { nextQuoteNumber } from "@/lib/quotes/pricing";

export type StoredLead = {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  industry: string;
  employees?: number;
  source: string;
  status: string;
  createdAt: string;
};

export type StoredQuote = {
  id: string;
  quoteNumber: string;
  leadId?: string;
  businessName: string;
  contactName: string;
  email: string;
  industry: string;
  employees?: number;
  websiteNeeds?: string;
  automationNeeds?: string;
  budgetRange: string;
  timeline: string;
  projectSummary: string;
  recommendedSolution: string;
  deliverables: string[];
  estimatedTimeline: string;
  priceEstimate: number;
  currency: string;
  terms: string;
  status: string;
  createdAt: string;
};

export type StoredBooking = {
  id: string;
  quoteId?: string;
  leadId?: string;
  name: string;
  email: string;
  company?: string;
  scheduledAt: string;
  durationMin: number;
  timezone: string;
  notes?: string;
  status: string;
  createdAt: string;
};

export type StoredConversation = {
  id: string;
  sessionId: string;
  leadId?: string;
  messages: unknown[];
  summary?: string;
  createdAt: string;
  updatedAt: string;
};

export type StoredAnalytics = {
  id: string;
  type: string;
  path?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

type LocalDb = {
  leads: StoredLead[];
  quotes: StoredQuote[];
  bookings: StoredBooking[];
  conversations: StoredConversation[];
  analytics: StoredAnalytics[];
};

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "luvatech-db.json");

function defaultDb(): LocalDb {
  return {
    leads: [],
    quotes: [],
    bookings: [],
    conversations: [],
    analytics: [],
  };
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readLocalDb(): LocalDb {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    const db = defaultDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    return db;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8")) as LocalDb;
}

export function writeLocalDb(db: LocalDb) {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function cuid(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function localCreateLead(input: QuoteInput & { source?: string }): StoredLead {
  const db = readLocalDb();
  const lead: StoredLead = {
    id: cuid(),
    businessName: input.businessName,
    contactName: input.contactName,
    email: input.email,
    phone: input.phone,
    industry: input.industry,
    employees: input.employees,
    source: input.source ?? "website",
    status: "NEW",
    createdAt: new Date().toISOString(),
  };
  db.leads.unshift(lead);
  writeLocalDb(db);
  return lead;
}

export function localCreateQuote(
  input: QuoteInput,
  estimate: QuoteEstimate,
  leadId?: string,
): StoredQuote {
  const db = readLocalDb();
  const quote: StoredQuote = {
    id: cuid(),
    quoteNumber: nextQuoteNumber(db.quotes.length),
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
    currency: "ZAR",
    terms: estimate.terms,
    status: "SENT",
    createdAt: new Date().toISOString(),
  };
  db.quotes.unshift(quote);
  writeLocalDb(db);
  return quote;
}

export function localCreateBooking(input: {
  name: string;
  email: string;
  company?: string;
  scheduledAt: string;
  notes?: string;
  quoteId?: string;
  leadId?: string;
}): StoredBooking {
  const db = readLocalDb();
  const booking: StoredBooking = {
    id: cuid(),
    quoteId: input.quoteId,
    leadId: input.leadId,
    name: input.name,
    email: input.email,
    company: input.company,
    scheduledAt: input.scheduledAt,
    durationMin: 30,
    timezone: "Africa/Johannesburg",
    notes: input.notes,
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
  };
  db.bookings.unshift(booking);
  writeLocalDb(db);
  return booking;
}

export function localUpsertConversation(
  sessionId: string,
  messages: unknown[],
  leadId?: string,
): StoredConversation {
  const db = readLocalDb();
  const existing = db.conversations.find((c) => c.sessionId === sessionId);
  const now = new Date().toISOString();
  if (existing) {
    existing.messages = messages;
    existing.updatedAt = now;
    if (leadId) existing.leadId = leadId;
  } else {
    db.conversations.unshift({
      id: cuid(),
      sessionId,
      leadId,
      messages,
      createdAt: now,
      updatedAt: now,
    });
  }
  writeLocalDb(db);
  return db.conversations.find((c) => c.sessionId === sessionId)!;
}

export function localTrackEvent(input: {
  type: string;
  path?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}) {
  const db = readLocalDb();
  db.analytics.unshift({
    id: cuid(),
    type: input.type,
    path: input.path,
    sessionId: input.sessionId,
    metadata: input.metadata,
    createdAt: new Date().toISOString(),
  });
  if (db.analytics.length > 5000) db.analytics = db.analytics.slice(0, 5000);
  writeLocalDb(db);
}

export function localGetDashboardStats() {
  const db = readLocalDb();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentLeads = db.leads.filter((l) => new Date(l.createdAt) >= weekAgo);
  const recentQuotes = db.quotes.filter((q) => new Date(q.createdAt) >= weekAgo);
  const upcomingBookings = db.bookings
    .filter((b) => new Date(b.scheduledAt) >= now && b.status === "CONFIRMED")
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  const pageViews = db.analytics.filter((a) => a.type === "page_view").length;
  const chatStarts = db.analytics.filter((a) => a.type === "chat_start").length;
  const quoteRequests = db.quotes.length;

  return {
    leads: db.leads,
    quotes: db.quotes,
    bookings: db.bookings,
    conversations: db.conversations,
    analytics: db.analytics,
    stats: {
      newLeadsThisWeek: recentLeads.length,
      quotesThisWeek: recentQuotes.length,
      upcomingMeetings: upcomingBookings.length,
      pageViews,
      chatStarts,
      quoteRequests,
      conversionRate:
        chatStarts > 0 ? Math.round((quoteRequests / chatStarts) * 100) : 0,
    },
    upcomingBookings,
  };
}
