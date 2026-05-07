import { describe, it, expect, vi, beforeEach } from 'vitest';
import { COOKIE_NAME, setSessionCookie, clearSessionCookie, readSessionCookie } from './cookie';

const cookieStore = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
};

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve(cookieStore),
}));

describe('cookie helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exposes the cookie name', () => {
    expect(COOKIE_NAME).toBe('cfb_token');
  });

  it('setSessionCookie sets HttpOnly Secure SameSite=Lax cookie', async () => {
    await setSessionCookie('abc.def.ghi');
    expect(cookieStore.set).toHaveBeenCalledWith(
      'cfb_token',
      'abc.def.ghi',
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
      }),
    );
  });

  it('clearSessionCookie deletes the cookie', async () => {
    await clearSessionCookie();
    expect(cookieStore.delete).toHaveBeenCalledWith('cfb_token');
  });

  it('readSessionCookie returns the cookie value when present', async () => {
    cookieStore.get.mockReturnValueOnce({ value: 'jwt-value' });
    const v = await readSessionCookie();
    expect(v).toBe('jwt-value');
  });

  it('readSessionCookie returns undefined when missing', async () => {
    cookieStore.get.mockReturnValueOnce(undefined);
    const v = await readSessionCookie();
    expect(v).toBeUndefined();
  });
});
