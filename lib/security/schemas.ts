import { z } from "zod";

export const MAX_SHORT = 200;
export const MAX_NOTES = 2000;
export const MAX_MESSAGE = 4096;

export const sessionIdSchema = z.string().uuid();

export const quoteInputSchema = z.object({
  businessName: z.string().min(2).max(MAX_SHORT),
  contactName: z.string().min(2).max(MAX_SHORT),
  email: z.string().email().max(MAX_SHORT),
  phone: z.string().max(30).optional(),
  industry: z.string().min(2).max(MAX_SHORT),
  employees: z.number().int().min(1).max(100000).optional(),
  websiteNeeds: z.string().max(MAX_NOTES).optional(),
  automationNeeds: z.string().min(10).max(MAX_NOTES),
  budgetRange: z.string().min(2).max(MAX_SHORT),
  timeline: z.string().min(2).max(MAX_SHORT),
});

export const bookingInputSchema = z.object({
  name: z.string().min(2).max(MAX_SHORT),
  email: z.string().email().max(MAX_SHORT),
  company: z.string().max(MAX_SHORT).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  notes: z.string().max(MAX_NOTES).optional(),
});

export const bookConsultationSchema = z.object({
  name: z.string().min(2).max(MAX_SHORT),
  email: z.string().email().max(MAX_SHORT),
  company: z.string().max(MAX_SHORT).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  notes: z.string().max(MAX_NOTES).optional(),
  quoteNumber: z.string().max(50).optional(),
});

const chatMessageSchema = z.object({
  id: z.string().max(100),
  role: z.enum(["user", "assistant", "system"]),
  parts: z
    .array(
      z.object({
        type: z.string(),
        text: z.string().max(MAX_MESSAGE).optional(),
      }),
    )
    .max(20),
});

export const chatBodySchema = z.object({
  sessionId: sessionIdSchema.optional(),
  messages: z.array(chatMessageSchema).min(1).max(50),
});

export const ANALYTICS_EVENT_TYPES = ["page_view", "chat_start", "cta_click"] as const;

export const analyticsBodySchema = z.object({
  type: z.enum(ANALYTICS_EVENT_TYPES),
  path: z.string().max(500).optional(),
  sessionId: sessionIdSchema.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
