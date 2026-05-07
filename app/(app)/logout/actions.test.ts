import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logoutAction } from './actions';

const mockClearCookie = vi.fn();
const mockRedirect = vi.fn(() => {
  throw new Error('NEXT_REDIRECT');
});

vi.mock('@/lib/auth/cookie', () => ({
  clearSessionCookie: () => mockClearCookie(),
}));
vi.mock('next/navigation', () => ({ redirect: (p: string) => mockRedirect(p) }));

describe('logoutAction', () => {
  beforeEach(() => vi.clearAllMocks());

  it('clears the cookie and redirects to /login', async () => {
    await expect(logoutAction()).rejects.toThrow('NEXT_REDIRECT');
    expect(mockClearCookie).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledWith('/login');
  });
});
