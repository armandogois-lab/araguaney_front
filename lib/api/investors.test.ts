import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listInvestors, createInvestor, updateInvestor } from './investors';

const mockApiFetch = vi.fn();
vi.mock('./client', () => ({
  apiFetch: (path: string, init?: RequestInit) => mockApiFetch(path, init),
  ApiError: class ApiError extends Error {},
}));

describe('listInvestors', () => {
  beforeEach(() => vi.clearAllMocks());

  it('GETs /api/investors with no params', async () => {
    mockApiFetch.mockResolvedValueOnce({ data: [], total: 0, limit: 50, offset: 0 });
    await listInvestors();
    expect(mockApiFetch).toHaveBeenCalledWith('/api/investors', { method: 'GET' });
  });

  it('appends filters to the query string', async () => {
    mockApiFetch.mockResolvedValueOnce({ data: [], total: 0, limit: 50, offset: 0 });
    await listInvestors({ q: 'alpha', kind: 'juridica', status: 'active', limit: 50, offset: 0 });
    const path = mockApiFetch.mock.calls[0][0] as string;
    expect(path).toContain('q=alpha');
    expect(path).toContain('kind=juridica');
    expect(path).toContain('status=active');
    expect(path).toContain('limit=50');
  });
});

describe('createInvestor', () => {
  beforeEach(() => vi.clearAllMocks());

  it('POSTs the body as JSON to /api/investors', async () => {
    mockApiFetch.mockResolvedValueOnce({
      id: 'inv-1',
      legal_name: 'Alpha',
      rif: 'J-1',
      kind: 'juridica',
      status: 'active',
      email: null,
      phone: null,
    });
    const result = await createInvestor({
      legal_name: 'Alpha',
      rif: 'J-1',
      kind: 'juridica',
    });
    expect(result.id).toBe('inv-1');
    const [path, init] = mockApiFetch.mock.calls[0];
    expect(path).toBe('/api/investors');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({
      legal_name: 'Alpha',
      rif: 'J-1',
      kind: 'juridica',
    });
  });
});

describe('updateInvestor', () => {
  beforeEach(() => vi.clearAllMocks());

  it('PATCHes /api/investors/{id} with JSON body', async () => {
    mockApiFetch.mockResolvedValueOnce({
      id: 'inv-1',
      legal_name: 'Inversora Alpha, C.A.',
      rif: 'J-12345678-9',
      kind: 'juridica',
      status: 'active',
      email: 'ops@alpha.com',
      phone: null,
      notes: null,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-05-11T10:00:00Z',
      updated_by: null,
      active_cert_count: 2,
      total_invested: '450000.0000',
    });
    const result = await updateInvestor('inv-1', {
      email: 'ops@alpha.com',
      status: 'active',
    });
    expect(result.email).toBe('ops@alpha.com');
    const [path, init] = mockApiFetch.mock.calls[0];
    expect(path).toBe('/api/investors/inv-1');
    expect(init.method).toBe('PATCH');
    expect(JSON.parse(init.body as string)).toEqual({
      email: 'ops@alpha.com',
      status: 'active',
    });
  });
});
