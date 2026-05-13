import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockApiFetch } = vi.hoisted(() => ({ mockApiFetch: vi.fn() }));

vi.mock('./client', () => ({
  apiFetch: (...a: unknown[]) => mockApiFetch(...a),
}));

import { listAudit } from './audit';

describe('listAudit', () => {
  beforeEach(() => vi.clearAllMocks());

  it('GETs /api/audit with no params', async () => {
    mockApiFetch.mockResolvedValueOnce({ data: [], total: 0, limit: 50, offset: 0 });
    await listAudit({});
    expect(mockApiFetch).toHaveBeenCalledWith('/api/audit', { method: 'GET' });
  });

  it('appends every supported filter', async () => {
    mockApiFetch.mockResolvedValueOnce({ data: [], total: 0, limit: 50, offset: 0 });
    await listAudit({
      limit: 50,
      offset: 100,
      entity_type: 'certificate',
      action: 'cancel',
      occurred_at_from: '2026-05-01',
      occurred_at_to: '2026-05-31',
    });
    const path = mockApiFetch.mock.calls[0][0] as string;
    expect(path).toContain('limit=50');
    expect(path).toContain('offset=100');
    expect(path).toContain('entity_type=certificate');
    expect(path).toContain('action=cancel');
    expect(path).toContain('occurred_at_from=2026-05-01');
    expect(path).toContain('occurred_at_to=2026-05-31');
  });

  it('returns the typed response', async () => {
    const fake = {
      data: [
        {
          id: 'evt-1',
          occurred_at: '2026-05-13T10:00:00Z',
          actor: { id: 'u-1', email: 'op@x.com', full_name: 'Op' },
          action: 'create',
          entity_type: 'certificate',
          entity_id: 'cert-uuid',
          ip_address: '1.2.3.4',
          user_agent: 'Mozilla',
          payload: { code: 'C4572A' },
        },
      ],
      total: 1,
      limit: 50,
      offset: 0,
    };
    mockApiFetch.mockResolvedValueOnce(fake);
    const result = await listAudit({});
    expect(result).toEqual(fake);
  });
});
