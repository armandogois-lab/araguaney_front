import { describe, it, expect } from 'vitest';
import { fmtDate } from './date';

describe('fmtDate', () => {
  it('formats ISO timestamps as DD/MM/YYYY', () => {
    expect(fmtDate('2026-04-20T14:30:00.000Z')).toBe('20/04/2026');
    expect(fmtDate('2026-01-01T00:00:00.000Z')).toBe('01/01/2026');
    expect(fmtDate('2026-12-31T23:59:59.000Z')).toBe('31/12/2026');
  });

  it('returns "—" for null', () => {
    expect(fmtDate(null)).toBe('—');
  });

  it('returns "—" for undefined', () => {
    expect(fmtDate(undefined)).toBe('—');
  });

  it('returns "—" for empty string', () => {
    expect(fmtDate('')).toBe('—');
  });

  it('returns "—" for invalid date strings', () => {
    expect(fmtDate('not-a-date')).toBe('—');
  });
});
