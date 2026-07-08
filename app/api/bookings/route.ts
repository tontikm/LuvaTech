import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createBooking,
  getAvailableSlotsForBooking,
  isSlotTaken,
} from "@/lib/db/queries";
import { isValidFutureSlot } from "@/lib/booking/slots";
import { sendBookingConfirmation } from "@/lib/email/templates";

const bookingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  date: z.string(),
  time: z.string(),
  notes: z.string().optional(),
});

export async function GET() {
  return NextResponse.json({ slots: await getAvailableSlotsForBooking(14) });
}

export async function POST(req: Request) {
  try {
    const body = bookingSchema.parse(await req.json());

    if (!isValidFutureSlot(body.date, body.time)) {
      return NextResponse.json(
        { error: "That time slot has already passed. Please choose another." },
        { status: 400 },
      );
    }

    if (await isSlotTaken(body.date, body.time)) {
      return NextResponse.json(
        { error: "That time slot is no longer available. Please choose another." },
        { status: 409 },
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
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}
