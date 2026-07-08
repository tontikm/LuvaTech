import { NextResponse } from "next/server";
import { z } from "zod";
import { trackEvent } from "@/lib/db/queries";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { analyticsBodySchema } from "@/lib/security/schemas";

export async function POST(req: Request) {
  const rateLimited = await enforceRateLimit(req, "analytics");
  if (rateLimited) return rateLimited;

  try {
    const body = analyticsBodySchema.parse(await req.json());

    if (body.metadata && JSON.stringify(body.metadata).length > 1024) {
      return NextResponse.json({ error: "metadata too large" }, { status: 400 });
    }

    await trackEvent({
      type: body.type,
      path: body.path,
      sessionId: body.sessionId,
      metadata: body.metadata,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 });
  }
}
