"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { DemoShell } from "@/components/demos/DemoShell";
import { formatDateInSast, isSlotInPast } from "@/lib/booking/slots";

const DEMO_TIMES = ["09:00", "10:30", "14:00", "15:30"];

function formatDayLabel(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00+02:00`).toLocaleDateString("en-ZA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "Africa/Johannesburg",
  });
}

function isWeekendInSast(date: Date): boolean {
  const label = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Johannesburg",
    weekday: "short",
  }).format(date);
  return label === "Sat" || label === "Sun";
}

function getDemoDays(times: string[], count: number) {
  const days: { date: string; label: string }[] = [];
  const start = new Date();

  for (let offset = 0; days.length < count && offset < count + 14; offset++) {
    const day = new Date(start);
    day.setDate(start.getDate() + offset);
    if (isWeekendInSast(day)) continue;

    const dateStr = formatDateInSast(day);
    const hasSlot = times.some((time) => !isSlotInPast(dateStr, time));
    if (!hasSlot) continue;

    days.push({ date: dateStr, label: formatDayLabel(dateStr) });
  }

  return days;
}

export function BookingSimulator({ compact }: { compact?: boolean }) {
  const [days, setDays] = useState<{ date: string; label: string }[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const next = getDemoDays(DEMO_TIMES, 5);
    setDays(next);
    setDate(next[0]?.date ?? "");
  }, []);

  const timesForDay = useMemo(
    () => DEMO_TIMES.filter((slot) => !date || !isSlotInPast(date, slot)),
    [date],
  );

  useEffect(() => {
    if (time && date && isSlotInPast(date, time)) {
      setTime("");
    }
  }, [date, time]);

  const hold =
    date && time
      ? {
          when: `${days.find((d) => d.date === date)?.label ?? date} at ${time} SAST`,
        }
      : null;

  return (
    <DemoShell title="LuvaTech · Scheduling" compact={compact}>
      <p className="text-xs text-white/45">
        Pick a slot. This is a UI demo hold, not a real booking.
      </p>

      <div className="mt-4">
        <label className="text-xs uppercase tracking-wider text-white/40">Date</label>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {days.length === 0
            ? Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className="h-9 w-24 animate-pulse rounded-lg border border-white/10 bg-white/[0.03]"
                />
              ))
            : days.map((day) => (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => {
                    setDate(day.date);
                    setTime("");
                  }}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-xs transition-colors",
                    date === day.date
                      ? "border-accent bg-accent/10 text-white"
                      : "border-white/10 text-white/50 hover:border-white/25",
                  )}
                >
                  {day.label}
                </button>
              ))}
        </div>
      </div>

      <div className="mt-4">
        <label className="text-xs uppercase tracking-wider text-white/40">Time</label>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {timesForDay.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => setTime(slot)}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs transition-colors",
                time === slot
                  ? "border-accent bg-accent/10 text-white"
                  : "border-white/10 text-white/50 hover:border-white/25",
              )}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {hold && (
        <motion.div
          key={hold.when}
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: 1,
            y: 0,
            boxShadow: [
              "0 0 0 0 rgba(45,212,191,0)",
              "0 0 24px 0 rgba(45,212,191,0.25)",
              "0 0 0 0 rgba(45,212,191,0)",
            ],
          }}
          transition={{ duration: 1.2, times: [0, 0.35, 1] }}
          className="mt-5 rounded-xl border border-accent/30 bg-accent/[0.07] p-4"
        >
          <div className="flex items-start gap-3">
            <CalendarCheck className="mt-0.5 h-5 w-5 text-accent" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Demo hold reserved</p>
              <p className="mt-1 text-xs text-white/50">{hold.when}</p>
              <Link href="/book" className="mt-3 inline-flex">
                <Button size="sm">
                  Book for real
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </DemoShell>
  );
}
