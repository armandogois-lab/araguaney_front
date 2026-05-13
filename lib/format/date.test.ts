import { describe, it, expect } from 'vitest';
import { fmtDate, fmtDateTime } from './date';

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

describe('fmtDateTime', () => {
  it('formats ISO timestamps as DD/MM/YYYY HH:MM:SS in UTC', () => {
    expect(fmtDateTime('2026-04-20T14:30:00.000Z')).toBe('20/04/2026 14:30:00');
    expect(fmtDateTime('2026-01-01T00:00:00.000Z')).toBe('01/01/2026 00:00:00');
    expect(fmtDateTime('2026-12-31T23:59:59.000Z')).toBe('31/12/2026 23:59:59');
  });

  it('pads single-digit hours, minutes, seconds', () => {
    expect(fmtDateTime('2026-05-13T05:07:09.000Z')).toBe('13/05/2026 05:07:09');
  });

  it('returns "—" for null, undefined, empty, or invalid', () => {
    expect(fmtDateTime(null)).toBe('—');
    expect(fmtDateTime(undefined)).toBe('—');
    expect(fmtDateTime('')).toBe('—');
    expect(fmtDateTime('not-a-date')).toBe('—');
  });
});
