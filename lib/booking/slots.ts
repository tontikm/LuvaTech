export const BOOKING_SLOT_TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
] as const;

const SAST_TIMEZONE = "Africa/Johannesburg";

export function formatDateInSast(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: SAST_TIMEZONE }).format(date);
}

function getWeekdayInSast(date: Date): number {
  const label = new Intl.DateTimeFormat("en-US", {
    timeZone: SAST_TIMEZONE,
    weekday: "short",
  }).format(date);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[label] ?? 0;
}

export function slotDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00+02:00`);
}

export function formatTimeInSast(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: SAST_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const hour = parts.find((p) => p.type === "hour")?.value.padStart(2, "0") ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${hour}:${minute}`;
}

export function slotKey(date: string, time: string): string {
  return `${date}|${time}`;
}

export function slotKeyFromDate(date: Date): string {
  return slotKey(formatDateInSast(date), formatTimeInSast(date));
}

export function isSlotInPast(date: string, time: string, now = new Date()): boolean {
  return slotDateTime(date, time) <= now;
}

export function isSlotBooked(
  date: string,
  time: string,
  bookedKeys: ReadonlySet<string>,
): boolean {
  return bookedKeys.has(slotKey(date, time));
}

export function isValidFutureSlot(date: string, time: string, now = new Date()): boolean {
  if (!(BOOKING_SLOT_TIMES as readonly string[]).includes(time)) return false;
  return !isSlotInPast(date, time, now);
}

export function getAvailableSlots(
  businessDays = 14,
  bookedKeys: ReadonlySet<string> = new Set(),
): Array<{ date: string; slots: string[] }> {
  const result: Array<{ date: string; slots: string[] }> = [];
  const start = new Date();

  for (let offset = 0; result.length < businessDays && offset < businessDays + 14; offset++) {
    const day = new Date(start);
    day.setDate(start.getDate() + offset);

    const dow = getWeekdayInSast(day);
    if (dow === 0 || dow === 6) continue;

    const dateStr = formatDateInSast(day);
    const slots = BOOKING_SLOT_TIMES.filter(
      (time) => !isSlotInPast(dateStr, time) && !isSlotBooked(dateStr, time, bookedKeys),
    );

    if (slots.length > 0) {
      result.push({ date: dateStr, slots: [...slots] });
    }
  }

  return result;
}
