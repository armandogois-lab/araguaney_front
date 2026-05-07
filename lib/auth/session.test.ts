import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCurrentUser } from './session';

const mockGetMe = vi.fn();
vi.mock('@/lib/api/me', () => ({ getMe: () => mockGetMe() }));

describe('getCurrentUser', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns user when getMe succeeds', async () => {
    mockGetMe.mockResolvedValueOnce({ id: '1', full_name: 'Alice' });
    const u = await getCurrentUser();
    expect(u).toEqual({ id: '1', full_name: 'Alice' });
  });

  it('returns null when getMe throws (e.g. 401)', async () => {
    mockGetMe.mockRejectedValueOnce(new Error('401'));
    const u = await getCurrentUser();
    expect(u).toBeNull();
  });
});
