import { describe, it, expect } from 'vitest';
import { fmtDate, fmtDateTime, fmtRelativeTime } from './date';

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

describe('fmtRelativeTime', () => {
  const now = new Date('2026-05-13T14:00:00.000Z');

  it('returns "ahora" within the first minute', () => {
    expect(fmtRelativeTime('2026-05-13T13:59:50.000Z', now)).toBe('ahora');
  });

  it('returns "hace Nm" for minutes < 60', () => {
    expect(fmtRelativeTime('2026-05-13T13:45:00.000Z', now)).toBe('hace 15m');
  });

  it('returns "hace Nh" for hours < 24', () => {
    expect(fmtRelativeTime('2026-05-13T11:00:00.000Z', now)).toBe('hace 3h');
  });

  it('returns "ayer" for 1 day ago', () => {
    expect(fmtRelativeTime('2026-05-12T14:00:00.000Z', now)).toBe('ayer');
  });

  it('returns "hace Nd" for 2..6 days ago', () => {
    expect(fmtRelativeTime('2026-05-10T14:00:00.000Z', now)).toBe('hace 3d');
  });

  it('falls back to fmtDate for entries older than a week', () => {
    expect(fmtRelativeTime('2026-04-01T14:00:00.000Z', now)).toBe('01/04/2026');
  });
});
