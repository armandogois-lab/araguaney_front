import { describe, it, expect, vi, beforeEach } from 'vitest';
import { countCertificatesIssued, simulateCertificate, issueCertificate } from './certificates';

const mockApiFetch = vi.fn();
vi.mock('./client', () => ({
  apiFetch: (path: string, init?: RequestInit) => mockApiFetch(path, init),
  ApiError: class ApiError extends Error {},
}));

describe('countCertificatesIssued', () => {
  beforeEach(() => vi.clearAllMocks());

  it('GETs /api/certificates with issue_date range and limit=1', async () => {
    mockApiFetch.mockResolvedValueOnce({ data: [], total: 7, limit: 1, offset: 0 });
    await countCertificatesIssued('2026-05-04', '2026-05-08');
    const path = mockApiFetch.mock.calls[0][0] as string;
    expect(path).toContain('issue_date_from=2026-05-04');
    expect(path).toContain('issue_date_to=2026-05-08');
    expect(path).toContain('limit=1');
  });

  it('returns just the total count', async () => {
    mockApiFetch.mockResolvedValueOnce({ data: [], total: 12, limit: 1, offset: 0 });
    const result = await countCertificatesIssued('2026-05-04', '2026-05-08');
    expect(result).toEqual({ total: 12 });
  });
});

describe('simulateCertificate', () => {
  beforeEach(() => vi.clearAllMocks());

  const rawBackResponse = {
    inputs: {
      investor: { id: 'inv-1', legal_name: 'Alpha', rif: 'J-1' },
      capital: '100000.0000',
      rate: '0.130000',
      term_days: 42 as const,
      issue_date: '2026-05-10',
      maturity_date: '2026-06-21',
    },
    pricing: { price: '0.984833', nominal_target: '101540.6000' },
    pool: {
      order_ids: ['o-1', 'o-2'],
      order_count: 2,
      merchant_count: 1,
      installment_count: 6,
      installment_plazo_days: { min: 7, max: 42 },
    },
    payouts: {
      nominal_actual: '101540.0000',
      investor_paid: '99999.4100',
      investor_returned: '0.5900',
      investor_yield: '1540.5900',
      shortfall_pct: '0.000006',
    },
    concentration: {
      top: [
        {
          merchant_id: 'm-1',
          current_name: 'Mercantil',
          rif: 'J-1',
          amount: '101540.0000',
          pct: '1.000000',
        },
      ],
      total_distinct_merchants: 1,
    },
    due_date_distribution: [{ date: '2026-06-08', amount: '101540.0000' }],
    payload_hash: 'abc',
  };

  it('POSTs body as JSON to /api/certificates/simulate', async () => {
    mockApiFetch.mockResolvedValueOnce(rawBackResponse);
    await simulateCertificate({
      investor_id: 'inv-1',
      capital: 100000,
      rate: 0.13,
      term_days: 42,
      issue_date: '2026-05-10',
    });
    const [path, init] = mockApiFetch.mock.calls[0];
    expect(path).toBe('/api/certificates/simulate');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({
      investor_id: 'inv-1',
      capital: 100000,
      rate: 0.13,
      term_days: 42,
      issue_date: '2026-05-10',
    });
  });

  it('flattens the back nested shape to the front internal SimulationResult', async () => {
    mockApiFetch.mockResolvedValueOnce(rawBackResponse);
    const result = await simulateCertificate({
      investor_id: 'inv-1',
      capital: 100000,
      rate: 0.13,
      term_days: 42,
      issue_date: '2026-05-10',
    });
    expect(result.investor.legal_name).toBe('Alpha');
    expect(result.capital).toBe('100000.0000');
    expect(result.price).toBe('0.984833');
    expect(result.nominal_actual).toBe('101540.0000');
    expect(result.investor_paid).toBe('99999.4100');
    expect(result.selected_orders).toHaveLength(2);
    expect(result.selected_orders[0].id).toBe('o-1');
    expect(result.total_distinct_merchants).toBe(1);
    expect(result.installment_plazo_days).toEqual({ min: 7, max: 42 });
    expect(result.concentration_top[0].current_name).toBe('Mercantil');
    expect(result.due_date_distribution[0].date).toBe('2026-06-08');
    expect(result.payload_hash).toBe('abc');
  });
});

describe('issueCertificate', () => {
  beforeEach(() => vi.clearAllMocks());

  it('POSTs simulate body + order_ids + payload_hash to /api/certificates', async () => {
    mockApiFetch.mockResolvedValueOnce({ id: 'c-1', code: 'C0001A' });
    await issueCertificate({
      investor_id: 'inv-1',
      capital: 100000,
      rate: 0.13,
      term_days: 42,
      issue_date: '2026-05-10',
      order_ids: ['o-1', 'o-2'],
      expected_payload_hash: 'abc123',
    });
    const init = mockApiFetch.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(init.body as string);
    expect(body.order_ids).toEqual(['o-1', 'o-2']);
    expect(body.expected_payload_hash).toBe('abc123');
  });
});
