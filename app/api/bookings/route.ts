import { NextResponse } from "next/server";
import { z } from "zod";
import { createBooking, getAvailableSlotsForBooking } from "@/lib/db/queries";
import { SlotTakenError } from "@/lib/db/errors";
import { isValidFutureSlot } from "@/lib/booking/slots";
import { sendBookingConfirmation } from "@/lib/email/templates";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { bookingInputSchema } from "@/lib/security/schemas";

export async function GET() {
  return NextResponse.json({ slots: await getAvailableSlotsForBooking(14) });
}

export async function POST(req: Request) {
  const rateLimited = await enforceRateLimit(req, "emailAction");
  if (rateLimited) return rateLimited;

  try {
    const body = bookingInputSchema.parse(await req.json());

    if (!isValidFutureSlot(body.date, body.time)) {
      return NextResponse.json(
        { error: "That time slot has already passed. Please choose another." },
        { status: 400 },
      );
    }

    const scheduledAt = new Date(`${body.date}T${body.time}:00+02:00`).toISOString();

    const booking = await createBooking({
      name: body.name,
      email: body.email,
      company: body.company,
      scheduledAt,
      notes: body.notes,
    });

    await sendBookingConfirmation({
      name: body.name,
      email: body.email,
      scheduledAt,
      company: body.company,
    });

    return NextResponse.json({ ok: true, booking });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    if (err instanceof SlotTakenError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}
