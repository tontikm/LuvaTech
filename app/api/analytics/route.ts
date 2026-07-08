import { NextResponse } from "next/server";
import { trackEvent } from "@/lib/db/queries";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, path, sessionId, metadata } = body;

    if (!type || typeof type !== "string") {
      return NextResponse.json({ error: "type required" }, { status: 400 });
    }

    await trackEvent({ type, path, sessionId, metadata });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 });
  }
}
