/**
 * Whole-day difference between `from` (YYYY-MM-DD) and `at` (default: now), in UTC.
 * Negative results clamp to 0 — we never want "día -2" on a hero strip.
 */
export function daysSince(from: string, at: Date = new Date()): number {
  const [y, m, d] = from.split('-').map(Number);
  const fromMs = Date.UTC(y, m - 1, d);
  const atMs = Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate());
  const diff = Math.floor((atMs - fromMs) / 86_400_000);
  return Math.max(0, diff);
}
