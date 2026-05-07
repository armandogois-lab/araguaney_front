import { describe, it, expect } from 'vitest';
import { middleware } from './middleware';
import { NextRequest } from 'next/server';

function req(url: string, cookies: Record<string, string> = {}) {
  const r = new NextRequest(new URL(url));
  for (const [k, v] of Object.entries(cookies)) r.cookies.set(k, v);
  return r;
}

describe('middleware', () => {
  it('redirects to /login when no cookie and accessing protected path', () => {
    const res = middleware(req('http://localhost/'));
    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toContain('/login');
  });

  it('redirects to / when cookie present and accessing /login', () => {
    const res = middleware(req('http://localhost/login', { cfb_token: 'abc' }));
    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toBe('http://localhost/');
  });

  it('allows /login when no cookie', () => {
    const res = middleware(req('http://localhost/login'));
    expect(res?.headers.get('location')).toBeNull();
  });

  it('allows / when cookie present', () => {
    const res = middleware(req('http://localhost/', { cfb_token: 'abc' }));
    expect(res?.headers.get('location')).toBeNull();
  });
});
