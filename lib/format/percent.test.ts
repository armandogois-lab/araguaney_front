import { describe, it, expect } from 'vitest';
import { fmtPct } from './percent';

describe('fmtPct', () => {
  it('formats a fraction as percent with 1 decimal by default', () => {
    expect(fmtPct(0.13)).toBe('13.0%');
    expect(fmtPct(0.984833)).toBe('98.5%');
  });

  it('respects decimals override', () => {
    expect(fmtPct(0.984833, 4)).toBe('98.4833%');
    expect(fmtPct(0.13, 0)).toBe('13%');
  });

  it('handles 0 and 1', () => {
    expect(fmtPct(0)).toBe('0.0%');
    expect(fmtPct(1, 0)).toBe('100%');
  });

  it('accepts string inputs (Decimal-as-string)', () => {
    expect(fmtPct('0.0152')).toBe('1.5%');
  });
});
