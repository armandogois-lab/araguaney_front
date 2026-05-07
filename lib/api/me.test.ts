import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMe } from './me';

const mockApiFetch = vi.fn();
vi.mock('./client', () => ({
  apiFetch: (path: string, init?: RequestInit) => mockApiFetch(path, init),
  ApiError: class ApiError extends Error {},
}));

describe('getMe', () => {
  beforeEach(() => vi.clearAllMocks());

  it('GETs /api/me and returns the user', async () => {
    mockApiFetch.mockResolvedValueOnce({
      id: '1',
      email: 'a@b.com',
      full_name: 'Alice',
      role: 'operator',
    });
    const r = await getMe();
    expect(mockApiFetch).toHaveBeenCalledWith('/api/me', { method: 'GET' });
    expect(r.full_name).toBe('Alice');
  });
});
