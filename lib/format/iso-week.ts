export interface CycleRange {
  weekNumber: number;
  monday: string;
  friday: string;
  dayIndex: number;
  weekLabel: string;
}

const MONTHS_ES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

function toUtcDate(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function fmtIso(d: Date): string {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * ISO 8601 week number (4-Thursday rule).
 * Matches back's helpers/iso-week.ts so cert.cycle_week aligns.
 */
function isoWeekNumber(d: Date): number {
  const target = toUtcDate(d);
  const dayNum = (target.getUTCDay() + 6) % 7; // Mon=0..Sun=6
  target.setUTCDate(target.getUTCDate() - dayNum + 3); // shift to Thursday
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
  return 1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 86_400_000));
}

export function currentCycleRange(now: Date = new Date()): CycleRange {
  const today = toUtcDate(now);
  const dayOfWeek = (today.getUTCDay() + 6) % 7; // Mon=0..Sun=6
  const mondayDate = new Date(today);
  mondayDate.setUTCDate(today.getUTCDate() - dayOfWeek);
  const fridayDate = new Date(mondayDate);
  fridayDate.setUTCDate(mondayDate.getUTCDate() + 4);

  // dayIndex is 1..5 for Mon-Fri. Sat (5) and Sun (6) clamp to 5.
  const dayIndex = dayOfWeek <= 4 ? dayOfWeek + 1 : 5;

  const mDay = mondayDate.getUTCDate();
  const fDay = fridayDate.getUTCDate();
  const mMonth = MONTHS_ES[mondayDate.getUTCMonth()];
  const fMonth = MONTHS_ES[fridayDate.getUTCMonth()];
  const weekLabel =
    mondayDate.getUTCMonth() === fridayDate.getUTCMonth()
      ? `del ${mDay} al ${fDay} de ${mMonth}`
      : `del ${mDay} de ${mMonth} al ${fDay} de ${fMonth}`;

  return {
    weekNumber: isoWeekNumber(today),
    monday: fmtIso(mondayDate),
    friday: fmtIso(fridayDate),
    dayIndex,
    weekLabel,
  };
}
