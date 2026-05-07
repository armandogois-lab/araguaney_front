import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { NextRequest } from 'next/server';

const mockClear = vi.fn();
vi.mock('@/lib/auth/cookie', () => ({
  clearSessionCookie: () => mockClear(),
}));

describe('GET /auth/clear', () => {
  beforeEach(() => vi.clearAllMocks());

  it('clears the session cookie and redirects to /login', async () => {
    const request = new NextRequest(new URL('http://localhost/auth/clear'));
    const response = await GET(request);
    expect(mockClear).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost/login');
  });
});
