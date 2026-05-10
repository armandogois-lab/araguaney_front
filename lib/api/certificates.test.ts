import { describe, it, expect, vi, beforeEach } from 'vitest';
import { countCertificatesIssued } from './certificates';

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
