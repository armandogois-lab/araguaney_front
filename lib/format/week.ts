function isoDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Returns YYYY-MM-DD of the most recent Monday at-or-before `d` in UTC.
 * Week starts on Monday (operations use lunes-as-week-start).
 */
export function mondayOfThisWeekUTC(d: Date = new Date()): string {
  const dow = d.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const daysFromMonday = (dow + 6) % 7; // Mon→0, Tue→1, ..., Sun→6
  const monday = new Date(d);
  monday.setUTCDate(monday.getUTCDate() - daysFromMonday);
  return isoDate(monday);
}

/** Returns YYYY-MM-DD for the given date in UTC (default: now). */
export function todayUTC(d: Date = new Date()): string {
  return isoDate(d);
}
