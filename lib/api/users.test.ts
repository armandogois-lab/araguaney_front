import { describe, it, expect, vi, beforeEach } from 'vitest';

const { apiFetchMock } = vi.hoisted(() => ({ apiFetchMock: vi.fn() }));
vi.mock('./client', () => ({ apiFetch: apiFetchMock }));

import { listUsers, updateUser } from './users';

describe('lib/api/users', () => {
  beforeEach(() => apiFetchMock.mockReset());

  it('listUsers without filters calls /api/users with no query string', async () => {
    apiFetchMock.mockResolvedValueOnce({ data: [], total: 0 });
    await listUsers();
    expect(apiFetchMock).toHaveBeenCalledWith('/api/users', { method: 'GET' });
  });

  it('listUsers serializes q/role/is_active as query params', async () => {
    apiFetchMock.mockResolvedValueOnce({ data: [], total: 0 });
    await listUsers({ q: 'ana', role: 'admin', is_active: false });
    expect(apiFetchMock).toHaveBeenCalledWith('/api/users?q=ana&role=admin&is_active=false', {
      method: 'GET',
    });
  });

  it('updateUser PATCHes with stringified body', async () => {
    apiFetchMock.mockResolvedValueOnce({ id: 'u-1' });
    await updateUser('u-1', { role: 'admin' });
    expect(apiFetchMock).toHaveBeenCalledWith('/api/users/u-1', {
      method: 'PATCH',
      body: JSON.stringify({ role: 'admin' }),
    });
  });
});
