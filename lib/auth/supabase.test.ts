import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signIn } from './supabase';

const mockSignInWithPassword = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: (args: unknown) => mockSignInWithPassword(args),
    },
  }),
}));

vi.mock('@/lib/env', () => ({
  getEnv: () => ({
    NEXT_PUBLIC_API_URL: 'http://test.local/api',
    NEXT_PUBLIC_SUPABASE_URL: 'https://x.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
  }),
}));

describe('signIn', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns ok=true with accessToken on successful auth', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      data: { session: { access_token: 'jwt-xyz' }, user: { id: 'u1' } },
      error: null,
    });

    const result = await signIn('a@b.com', 'pass');

    expect(mockSignInWithPassword).toHaveBeenCalledWith({ email: 'a@b.com', password: 'pass' });
    expect(result).toEqual({ ok: true, accessToken: 'jwt-xyz' });
  });

  it('returns ok=false with error message when Supabase returns error', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      data: { session: null, user: null },
      error: { message: 'Invalid credentials' },
    });

    const result = await signIn('a@b.com', 'wrong');

    expect(result).toEqual({ ok: false, error: 'Invalid credentials' });
  });

  it('returns ok=false when session is missing despite no error', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      data: { session: null, user: null },
      error: null,
    });

    const result = await signIn('a@b.com', 'pass');

    expect(result.ok).toBe(false);
  });
});
