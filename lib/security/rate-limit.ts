import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitPreset = "chat" | "emailAction" | "analytics" | "adminLogin";

const PRESETS: Record<
  RateLimitPreset,
  { requests: number; window: `${number} ${"s" | "m" | "h" | "d"}` }
> = {
  chat: { requests: 20, window: "10 m" },
  emailAction: { requests: 5, window: "1 h" },
  analytics: { requests: 60, window: "10 m" },
  adminLogin: { requests: 10, window: "15 m" },
};

let redis: Redis | null = null;
const limiters = new Map<RateLimitPreset, Ratelimit>();

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  if (!redis) redis = new Redis({ url, token });
  return redis;
}

function getLimiter(preset: RateLimitPreset): Ratelimit | null {
  const client = getRedis();
  if (!client) return null;

  let limiter = limiters.get(preset);
  if (!limiter) {
    const config = PRESETS[preset];
    limiter = new Ratelimit({
      redis: client,
      limiter: Ratelimit.slidingWindow(config.requests, config.window),
      prefix: `luvatech:rl:${preset}`,
    });
    limiters.set(preset, limiter);
  }
  return limiter;
}

export function extractClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

export function extractIpFromForwardedHeader(forwardedFor: string | null): string {
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  return "unknown";
}

export async function checkRateLimit(
  identifier: string,
  preset: RateLimitPreset,
): Promise<{ success: true } | { success: false; status: 429 | 503 }> {
  const limiter = getLimiter(preset);
  if (!limiter) {
    if (process.env.NODE_ENV === "production") {
      console.error(`[rate-limit] Upstash not configured for ${preset}`);
      return { success: false, status: 503 };
    }
    return { success: true };
  }

  const { success } = await limiter.limit(identifier);
  if (!success) return { success: false, status: 429 };
  return { success: true };
}

export async function enforceRateLimit(
  req: Request,
  preset: RateLimitPreset,
): Promise<Response | null> {
  const ip = extractClientIp(req);
  const result = await checkRateLimit(ip, preset);
  if (result.success) return null;

  const message =
    result.status === 503
      ? "Rate limiting is not configured."
      : "Too many requests. Please try again later.";

  return new Response(JSON.stringify({ error: message }), {
    status: result.status,
    headers: { "Content-Type": "application/json" },
  });
}
