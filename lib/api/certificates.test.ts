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

  it('POSTs body as JSON to /api/certificates/simulate', async () => {
    mockApiFetch.mockResolvedValueOnce({ payload_hash: 'abc' });
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
