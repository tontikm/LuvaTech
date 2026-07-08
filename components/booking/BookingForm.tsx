"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Check, Loader2 } from "lucide-react";
import { Button, GlassCard } from "@/components/ui";
import { CONTACT } from "@/lib/site";
import { isSlotInPast } from "@/lib/booking/slots";

type SlotDay = { date: string; slots: string[] };

export function BookingForm() {
  const [slots, setSlots] = useState<SlotDay[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [slotsLoaded, setSlotsLoaded] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSlots() {
      try {
        const res = await fetch("/api/bookings");
        const d = await res.json();
        if (!cancelled) {
          setSlots(d.slots ?? []);
          setSlotsLoaded(true);
        }
      } catch {
        if (!cancelled) setSlotsLoaded(true);
      }
    }

    loadSlots();
    const interval = setInterval(loadSlots, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const daySlots = useMemo(() => {
    const slotsForDay = slots.find((s) => s.date === selectedDate)?.slots ?? [];
    return slotsForDay.filter((time) => !isSlotInPast(selectedDate, time));
  }, [slots, selectedDate]);

  useEffect(() => {
    if (selectedTime && selectedDate && isSlotInPast(selectedDate, selectedTime)) {
      setSelectedTime("");
    }
  }, [selectedDate, selectedTime]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, date: selectedDate, time: selectedTime, notes }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Could not complete booking. Please try again.");
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete booking. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <GlassCard className="text-center">
        <Check className="mx-auto h-10 w-10 text-green-400" />
        <h2 className="mt-4 text-xl font-semibold">Consultation booked</h2>
        <p className="mt-2 text-white/50">
          Confirmation sent to {email}. We&apos;ll discuss your project and next steps.
        </p>
      </GlassCard>
    );
  }

  if (slotsLoaded && slots.length === 0) {
    return (
      <GlassCard className="text-center">
        <Calendar className="mx-auto h-10 w-10 text-white/30" />
        <h2 className="mt-4 text-lg font-semibold">No slots available right now</h2>
        <p className="mt-2 text-sm text-white/50">
          Check back tomorrow or email us at{" "}
          <a href={`mailto:${CONTACT.email}`} className="text-accent hover:underline">
            {CONTACT.email}
          </a>
          .
        </p>
      </GlassCard>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-sm text-white/50">Select date</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {!slotsLoaded
            ? Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className="h-10 w-24 animate-pulse rounded-lg border border-white/10 bg-white/[0.03]"
                />
              ))
            : slots.map((day) => (
            <button
              key={day.date}
              type="button"
              onClick={() => {
                setSelectedDate(day.date);
                setSelectedTime("");
              }}
              className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                selectedDate === day.date
                  ? "border-accent bg-accent/10 text-white"
                  : "border-white/10 text-white/60 hover:border-white/20"
              }`}
            >
              {new Date(`${day.date}T12:00:00+02:00`).toLocaleDateString("en-ZA", {
                weekday: "short",
                month: "short",
                day: "numeric",
                timeZone: "Africa/Johannesburg",
              })}
            </button>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div>
          <label className="text-sm text-white/50">Select time (SAST)</label>
          {daySlots.length === 0 ? (
            <p className="mt-2 text-sm text-white/45">
              No times left on this date. Please choose another day.
            </p>
          ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {daySlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                  selectedTime === time
                    ? "border-accent bg-accent/10 text-white"
                    : "border-white/10 text-white/60 hover:border-white/20"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm text-white/50">Your name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm outline-none focus:border-accent/50"
          />
        </div>
        <div>
          <label className="text-sm text-white/50">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm outline-none focus:border-accent/50"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-white/50">Company (optional)</label>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm outline-none focus:border-accent/50"
        />
      </div>

      <div>
        <label className="text-sm text-white/50">What would you like to discuss?</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm outline-none focus:border-accent/50 resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button
        type="submit"
        size="lg"
        disabled={loading || !selectedDate || !selectedTime || !name || !email}
        className="w-full disabled:opacity-40"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Calendar className="h-4 w-4" />
            Confirm Booking
          </>
        )}
      </Button>
    </form>
  );
}

export function BookingPageContent() {
  return (
    <div className="pt-32 pb-32">
      <div className="mx-auto max-w-2xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-medium uppercase tracking-wider text-accent">
            Free consultation
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
            Book a demo
          </h1>
          <p className="mt-4 text-white/50 leading-relaxed">
            30-minute strategy call. We&apos;ll review your requirements, walk through live
            demos, and outline a delivery plan.
          </p>
        </motion.div>
        <div className="mt-12">
          <BookingForm />
        </div>
      </div>
    </div>
  );
}
