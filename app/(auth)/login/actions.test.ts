import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginAction } from './actions';

const mockSignIn = vi.fn();
const mockSetCookie = vi.fn();
const mockRedirect = vi.fn(() => {
  throw new Error('NEXT_REDIRECT');
});

vi.mock('@/lib/auth/supabase', () => ({
  signIn: (email: string, password: string) => mockSignIn(email, password),
}));
vi.mock('@/lib/auth/cookie', () => ({
  setSessionCookie: (jwt: string) => mockSetCookie(jwt),
}));
vi.mock('next/navigation', () => ({ redirect: (path: string) => mockRedirect(path) }));

function makeFormData(email: string, password: string) {
  const fd = new FormData();
  fd.set('email', email);
  fd.set('password', password);
  return fd;
}

describe('loginAction', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns error on invalid email format', async () => {
    const r = await loginAction(makeFormData('not-an-email', 'pass'));
    expect(r.error).toMatch(/correo o contraseña inválidos/i);
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('returns error on missing password', async () => {
    const r = await loginAction(makeFormData('a@b.com', ''));
    expect(r.error).toMatch(/correo o contraseña inválidos/i);
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('on success: sets cookie and redirects to /', async () => {
    mockSignIn.mockResolvedValueOnce({ ok: true, accessToken: 'jwt-xyz' });
    await expect(loginAction(makeFormData('a@b.com', 'pass'))).rejects.toThrow('NEXT_REDIRECT');
    expect(mockSignIn).toHaveBeenCalledWith('a@b.com', 'pass');
    expect(mockSetCookie).toHaveBeenCalledWith('jwt-xyz');
    expect(mockRedirect).toHaveBeenCalledWith('/');
  });

  it('returns error from Supabase on auth failure', async () => {
    mockSignIn.mockResolvedValueOnce({ ok: false, error: 'Invalid credentials' });
    const r = await loginAction(makeFormData('a@b.com', 'wrong'));
    expect(r.error).toBe('Invalid credentials');
    expect(mockSetCookie).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
