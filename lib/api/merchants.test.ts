import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listMerchants } from './merchants';

const mockApiFetch = vi.fn();
vi.mock('./client', () => ({
  apiFetch: (path: string, init?: RequestInit) => mockApiFetch(path, init),
  ApiError: class ApiError extends Error {},
}));

describe('listMerchants', () => {
  beforeEach(() => vi.clearAllMocks());

  it('GETs /api/merchants with limit + sort', async () => {
    mockApiFetch.mockResolvedValueOnce({ data: [], total: 0, limit: 200, offset: 0 });
    await listMerchants({ limit: 200, sort: 'name_asc' });
    expect(mockApiFetch).toHaveBeenCalledWith('/api/merchants?limit=200&sort=name_asc', {
      method: 'GET',
    });
  });

  it('returns the parsed response', async () => {
    const expected = {
      data: [
        {
          id: 'm-1',
          rif: 'J-1',
          current_name: 'Mercantil',
          first_seen_at: '2026-05-01T00:00:00Z',
          last_seen_at: '2026-05-08T00:00:00Z',
          order_count: 5,
          total_orders_amount: '1500.0000',
        },
      ],
      total: 1,
      limit: 200,
      offset: 0,
    };
    mockApiFetch.mockResolvedValueOnce(expected);
    const result = await listMerchants({ limit: 200 });
    expect(result).toEqual(expected);
  });
});
