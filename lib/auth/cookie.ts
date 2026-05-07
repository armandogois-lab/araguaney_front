import 'server-only';
import { cookies } from 'next/headers';

export const COOKIE_NAME = 'cfb_token';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24,
};

export async function setSessionCookie(jwt: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, jwt, COOKIE_OPTIONS);
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function readSessionCookie(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value;
}
