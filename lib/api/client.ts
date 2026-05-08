import 'server-only';
import { readSessionCookie } from '@/lib/auth/cookie';
import { getEnv } from '@/lib/env';
import { ApiError } from './error';

export { ApiError };

export async function apiFetch<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const { NEXT_PUBLIC_API_URL } = getEnv();
  const headers = new Headers(init?.headers);
  if (!headers.has('content-type') && init?.body && !(init.body instanceof FormData)) {
    headers.set('content-type', 'application/json');
  }

  const token = await readSessionCookie();
  if (token) headers.set('authorization', `Bearer ${token}`);

  const res = await fetch(`${NEXT_PUBLIC_API_URL}${path}`, { ...init, headers });

  const text = await res.text();
  const body: unknown = text ? safeJson(text) : null;

  if (!res.ok) {
    throw new ApiError(res.status, body);
  }

  return body as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
