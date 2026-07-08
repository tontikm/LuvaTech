import { Redis } from "@upstash/redis";

export type ActionType = "quote" | "booking";

const LIMITS: Record<ActionType, number> = {
  quote: 3,
  booking: 2,
};

const TTL_SECONDS = 86_400;

let redis: Redis | null = null;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  if (!redis) redis = new Redis({ url, token });
  return redis;
}

function actionKey(action: ActionType, ip: string, sessionId?: string): string {
  return `luvatech:action:${action}:${ip}:${sessionId ?? "anon"}`;
}

export async function checkActionLimit(
  action: ActionType,
  ip: string,
  sessionId?: string,
): Promise<{ allowed: true } | { allowed: false; message: string }> {
  const client = getRedis();
  if (!client) {
    if (process.env.NODE_ENV === "production") {
      return {
        allowed: false,
        message: "Service temporarily unavailable. Please try again later.",
      };
    }
    return { allowed: true };
  }

  const key = actionKey(action, ip, sessionId);
  const count = await client.get<number>(key);
  if (count !== null && count >= LIMITS[action]) {
    return {
      allowed: false,
      message: `Daily limit reached for ${action === "quote" ? "quote generation" : "bookings"}. Please try again tomorrow or contact us directly.`,
    };
  }
  return { allowed: true };
}

export async function recordAction(
  action: ActionType,
  ip: string,
  sessionId?: string,
): Promise<void> {
  const client = getRedis();
  if (!client) return;

  const key = actionKey(action, ip, sessionId);
  const count = await client.incr(key);
  if (count === 1) await client.expire(key, TTL_SECONDS);
}
