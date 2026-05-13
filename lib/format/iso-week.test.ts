import { describe, it, expect } from 'vitest';
import { currentCycleRange } from './iso-week';

describe('currentCycleRange', () => {
  it('Wednesday of week 17 → range Mon-Fri, dayIndex 3, label crosses no months', () => {
    const wed = new Date(Date.UTC(2026, 3, 22)); // 2026-04-22, Wednesday
    const r = currentCycleRange(wed);
    expect(r.weekNumber).toBe(17);
    expect(r.monday).toBe('2026-04-20');
    expect(r.friday).toBe('2026-04-24');
    expect(r.dayIndex).toBe(3);
    expect(r.weekLabel).toBe('del 20 al 24 de abril');
  });

  it('Monday → dayIndex 1', () => {
    const mon = new Date(Date.UTC(2026, 3, 20));
    expect(currentCycleRange(mon).dayIndex).toBe(1);
  });

  it('Friday → dayIndex 5', () => {
    const fri = new Date(Date.UTC(2026, 3, 24));
    expect(currentCycleRange(fri).dayIndex).toBe(5);
  });

  it('Saturday / Sunday → dayIndex clamped to 5 (cycle closed)', () => {
    const sat = new Date(Date.UTC(2026, 3, 25));
    const sun = new Date(Date.UTC(2026, 3, 26));
    expect(currentCycleRange(sat).dayIndex).toBe(5);
    expect(currentCycleRange(sun).dayIndex).toBe(5);
    // Sat/Sun still belong to the same Mon-Fri week
    expect(currentCycleRange(sat).monday).toBe('2026-04-20');
    expect(currentCycleRange(sun).friday).toBe('2026-04-24');
  });

  it('label crosses two months: del 30 de marzo al 3 de abril', () => {
    const wed = new Date(Date.UTC(2026, 3, 1)); // 2026-04-01, Wednesday
    const r = currentCycleRange(wed);
    expect(r.monday).toBe('2026-03-30');
    expect(r.friday).toBe('2026-04-03');
    expect(r.weekLabel).toBe('del 30 de marzo al 3 de abril');
  });
});
