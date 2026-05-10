import { describe, it, expect } from 'vitest';
import { mondayOfThisWeekUTC, todayUTC } from './week';

describe('mondayOfThisWeekUTC', () => {
  it('returns the same day when given a Monday', () => {
    // 2026-05-04 is a Monday
    const monday = new Date(Date.UTC(2026, 4, 4, 14, 30, 0));
    expect(mondayOfThisWeekUTC(monday)).toBe('2026-05-04');
  });

  it('returns the previous Monday when given a Wednesday', () => {
    // 2026-05-06 Wed → Monday is 2026-05-04
    const wed = new Date(Date.UTC(2026, 4, 6, 9, 0, 0));
    expect(mondayOfThisWeekUTC(wed)).toBe('2026-05-04');
  });

  it('returns the previous Monday when given a Sunday', () => {
    // 2026-05-10 Sun → Monday is 2026-05-04 (NOT 2026-05-11)
    const sun = new Date(Date.UTC(2026, 4, 10, 23, 59, 59));
    expect(mondayOfThisWeekUTC(sun)).toBe('2026-05-04');
  });

  it('returns the previous Monday when given a Saturday', () => {
    // 2026-05-09 Sat → Monday is 2026-05-04
    const sat = new Date(Date.UTC(2026, 4, 9, 12, 0, 0));
    expect(mondayOfThisWeekUTC(sat)).toBe('2026-05-04');
  });
});

describe('todayUTC', () => {
  it('returns the date portion of the given moment in UTC', () => {
    const t = new Date(Date.UTC(2026, 4, 8, 23, 59, 0));
    expect(todayUTC(t)).toBe('2026-05-08');
  });

  it('uses the current date when called with no argument', () => {
    const result = todayUTC();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
