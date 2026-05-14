import { describe, it, expect } from 'vitest';
import { filterCertsBySearch } from './filter';
import type { CertificateSummary } from '@/lib/types/certificate';

function cert(over: Partial<CertificateSummary> = {}): CertificateSummary {
  return {
    id: 'c-' + Math.random(),
    certificate_code: 'C4572A',
    certificate_type: 'standard',
    status: 'issued',
    investor: { id: 'inv-1', legal_name: 'Inversora Alpha, C.A.', rif: 'J-12345678-9' },
    investor_capital: '100000.0000',
    annual_rate: '0.130000',
    term_days: 42,
    price: '0.985060',
    nominal_target: '101516.6589',
    nominal_actual: '101516.0000',
    investor_paid: '99999.3510',
    investor_yield: '1516.6490',
    shortfall_pct: '0.000006',
    issue_date: '2026-04-27',
    maturity_date: '2026-06-08',
    cycle_week: '2026-W17',
    issued_by: { id: 'u-1', email: 'maria@cashea.app', full_name: 'María Rodríguez' },
    created_at: '2026-04-27T14:30:00Z',
    ...over,
  };
}

describe('filterCertsBySearch', () => {
  it('empty query returns all certs with mode "all"', () => {
    const certs = [cert({ id: 'c-1' }), cert({ id: 'c-2' })];
    const r = filterCertsBySearch(certs, '');
    expect(r).toHaveLength(2);
    expect(r.every((x) => x.mode === 'all')).toBe(true);
  });

  it('matches on certificate_code (case-insensitive)', () => {
    const certs = [
      cert({ id: 'c-1', certificate_code: 'C4572A' }),
      cert({ id: 'c-2', certificate_code: 'C9999X' }),
    ];
    const r = filterCertsBySearch(certs, 'c4572');
    expect(r).toHaveLength(1);
    expect(r[0].cert.id).toBe('c-1');
    expect(r[0].mode).toBe('match-cert');
  });

  it('matches on investor legal_name', () => {
    const certs = [
      cert({ id: 'c-1', investor: { id: 'i-1', legal_name: 'Inversora Alpha', rif: 'J-1' } }),
      cert({ id: 'c-2', investor: { id: 'i-2', legal_name: 'Otro Fondo', rif: 'J-2' } }),
    ];
    const r = filterCertsBySearch(certs, 'alpha');
    expect(r).toHaveLength(1);
    expect(r[0].cert.id).toBe('c-1');
  });

  it('matches on investor rif', () => {
    const certs = [
      cert({ id: 'c-1', investor: { id: 'i-1', legal_name: 'A', rif: 'J-12345678-9' } }),
    ];
    const r = filterCertsBySearch(certs, '12345678');
    expect(r).toHaveLength(1);
    expect(r[0].cert.id).toBe('c-1');
  });

  it('matches on issued_by full_name', () => {
    const certs = [
      cert({
        id: 'c-1',
        issued_by: { id: 'u-1', email: 'maria@x.com', full_name: 'María Rodríguez' },
      }),
    ];
    const r = filterCertsBySearch(certs, 'maría');
    expect(r).toHaveLength(1);
  });

  it('drops certs with no match', () => {
    const certs = [
      cert({ id: 'c-1', certificate_code: 'C0001A' }),
      cert({ id: 'c-2', certificate_code: 'C0002B' }),
    ];
    const r = filterCertsBySearch(certs, 'xxxnomatchxxx');
    expect(r).toHaveLength(0);
  });
});
