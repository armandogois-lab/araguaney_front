import { describe, it, expect } from 'vitest';
import { daysSince } from './cycle-day';

describe('daysSince', () => {
  it('returns 0 when the reference is today', () => {
    const today = new Date(Date.UTC(2026, 4, 10, 14, 30, 0));
    expect(daysSince('2026-05-10', today)).toBe(0);
  });

  it('returns N for N whole days elapsed', () => {
    const ref = new Date(Date.UTC(2026, 4, 12, 0, 0, 0));
    expect(daysSince('2026-05-10', ref)).toBe(2);
  });

  it('returns 0 when reference is before the date (clamped)', () => {
    const ref = new Date(Date.UTC(2026, 4, 5, 0, 0, 0));
    expect(daysSince('2026-05-10', ref)).toBe(0);
  });

  it('handles end of month boundary', () => {
    const ref = new Date(Date.UTC(2026, 5, 2, 0, 0, 0)); // 2026-06-02
    expect(daysSince('2026-05-30', ref)).toBe(3);
  });
});
