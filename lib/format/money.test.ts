import { describe, it, expect } from 'vitest';
import { fmtMoney, fmtMoney2 } from './money';

describe('fmtMoney', () => {
  it('formats integers with thousand separators and no decimals', () => {
    expect(fmtMoney(1132418)).toBe('$1,132,418');
    expect(fmtMoney(0)).toBe('$0');
    expect(fmtMoney(999)).toBe('$999');
  });

  it('formats non-integers with two decimals by default', () => {
    expect(fmtMoney(1247.5)).toBe('$1,247.50');
    expect(fmtMoney(0.1)).toBe('$0.10');
  });

  it('respects explicit decimals override', () => {
    expect(fmtMoney(1132418, 2)).toBe('$1,132,418.00');
    expect(fmtMoney(1247.567, 0)).toBe('$1,248');
  });

  it('handles negatives', () => {
    expect(fmtMoney(-500)).toBe('-$500');
    expect(fmtMoney(-1247.5)).toBe('-$1,247.50');
  });
});

describe('fmtMoney2', () => {
  it('always uses two decimals', () => {
    expect(fmtMoney2(1132418)).toBe('$1,132,418.00');
    expect(fmtMoney2(1247.5)).toBe('$1,247.50');
  });
});
