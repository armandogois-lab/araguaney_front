import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listOrders, getOrdersStats } from './orders';

const mockApiFetch = vi.fn();
vi.mock('./client', () => ({
  apiFetch: (path: string, init?: RequestInit) => mockApiFetch(path, init),
  ApiError: class ApiError extends Error {},
}));

describe('listOrders', () => {
  beforeEach(() => vi.clearAllMocks());

  it('GETs /api/orders with limit + offset when no filters', async () => {
    mockApiFetch.mockResolvedValueOnce({ data: [], total: 0, limit: 50, offset: 0 });
    await listOrders({ limit: 50, offset: 0 });
    expect(mockApiFetch).toHaveBeenCalledWith('/api/orders?limit=50&offset=0', { method: 'GET' });
  });

  it('appends every supported filter to the query string', async () => {
    mockApiFetch.mockResolvedValueOnce({ data: [], total: 0, limit: 50, offset: 0 });
    await listOrders({
      limit: 50,
      offset: 0,
      status: 'available',
      merchant_id: 'm-1',
      max_due_date_lte: '2026-05-31',
      q: '8565',
      sort: 'purchase_date_desc',
    });
    const path = mockApiFetch.mock.calls[0][0] as string;
    expect(path).toContain('status=available');
    expect(path).toContain('merchant_id=m-1');
    expect(path).toContain('max_due_date_lte=2026-05-31');
    expect(path).toContain('q=8565');
    expect(path).toContain('sort=purchase_date_desc');
  });

  it('returns the parsed response unchanged', async () => {
    const expected = {
      data: [{ id: 'o-1', external_order_id: 'ORD-1' }],
      total: 1,
      limit: 50,
      offset: 0,
    };
    mockApiFetch.mockResolvedValueOnce(expected);
    const result = await listOrders({ limit: 50, offset: 0 });
    expect(result).toEqual(expected);
  });
});

describe('getOrdersStats', () => {
  beforeEach(() => vi.clearAllMocks());

  it('GETs /api/orders/stats with no params', async () => {
    mockApiFetch.mockResolvedValueOnce({
      by_status: {
        available: { count: 0, total_amount: '0', total_installments_amount: '0' },
        assigned: { count: 0, total_amount: '0', total_installments_amount: '0' },
        matured: { count: 0, total_amount: '0', total_installments_amount: '0' },
        defaulted: { count: 0, total_amount: '0', total_installments_amount: '0' },
      },
      total_orders: 0,
      available_capital: '0',
    });
    await getOrdersStats();
    expect(mockApiFetch).toHaveBeenCalledWith('/api/orders/stats', { method: 'GET' });
  });
});
