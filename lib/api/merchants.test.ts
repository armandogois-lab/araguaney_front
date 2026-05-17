import { describe, it, expect, vi, beforeEach } from 'vitest';

const { apiFetchMock } = vi.hoisted(() => ({ apiFetchMock: vi.fn() }));
vi.mock('./client', () => ({ apiFetch: apiFetchMock }));

import { listMerchants, getMerchantDetail } from './merchants';

describe('lib/api/merchants', () => {
  beforeEach(() => apiFetchMock.mockReset());

  it('listMerchants without filters calls /api/merchants with no query string', async () => {
    apiFetchMock.mockResolvedValueOnce({ data: [], total: 0, limit: 25, offset: 0 });
    await listMerchants();
    expect(apiFetchMock).toHaveBeenCalledWith('/api/merchants', { method: 'GET' });
  });

  it('listMerchants serializes q/sort/limit/offset as query params', async () => {
    apiFetchMock.mockResolvedValueOnce({ data: [], total: 0, limit: 25, offset: 50 });
    await listMerchants({ q: 'mercantil', sort: 'last_seen_desc', limit: 25, offset: 50 });
    expect(apiFetchMock).toHaveBeenCalledWith(
      '/api/merchants?q=mercantil&sort=last_seen_desc&limit=25&offset=50',
      { method: 'GET' },
    );
  });

  it('getMerchantDetail GETs /api/merchants/:id', async () => {
    apiFetchMock.mockResolvedValueOnce({ id: 'm-1' });
    await getMerchantDetail('m-1');
    expect(apiFetchMock).toHaveBeenCalledWith('/api/merchants/m-1', { method: 'GET' });
  });
});
