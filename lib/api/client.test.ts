import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiFetch, ApiError } from './client';

const mockReadCookie = vi.fn();
const mockClearCookie = vi.fn();

vi.mock('@/lib/auth/cookie', () => ({
  readSessionCookie: () => mockReadCookie(),
  clearSessionCookie: () => mockClearCookie(),
}));

vi.mock('@/lib/env', () => ({
  getEnv: () => ({
    NEXT_PUBLIC_API_URL: 'http://test.local',
    NEXT_PUBLIC_SUPABASE_URL: 'https://x.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'k',
  }),
}));

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

describe('apiFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('attaches Bearer header when cookie present', async () => {
    mockReadCookie.mockResolvedValueOnce('jwt-abc');
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    await apiFetch('/api/me', { method: 'GET' });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://test.local/api/me');
    expect((init.headers as Headers).get('authorization')).toBe('Bearer jwt-abc');
  });

  it('omits Bearer when no cookie', async () => {
    mockReadCookie.mockResolvedValueOnce(undefined);
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    await apiFetch('/api/me', { method: 'GET' });

    const init = fetchMock.mock.calls[0][1];
    expect((init.headers as Headers).get('authorization')).toBeNull();
  });

  it('throws ApiError on 401 without mutating cookies', async () => {
    mockReadCookie.mockResolvedValueOnce('expired-jwt');
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'Token expired' }), { status: 401 }),
    );

    await expect(apiFetch('/api/me', { method: 'GET' })).rejects.toBeInstanceOf(ApiError);
    expect(mockClearCookie).not.toHaveBeenCalled();
  });

  it('throws ApiError on non-OK without clearing cookie', async () => {
    mockReadCookie.mockResolvedValueOnce('valid-jwt');
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'Bad request' }), { status: 400 }),
    );

    await expect(apiFetch('/api/me', { method: 'GET' })).rejects.toBeInstanceOf(ApiError);
    expect(mockClearCookie).not.toHaveBeenCalled();
  });

  it('returns parsed JSON on 200', async () => {
    mockReadCookie.mockResolvedValueOnce('jwt');
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: '1', name: 'Test' }), { status: 200 }),
    );

    const result = await apiFetch<{ id: string; name: string }>('/api/me', { method: 'GET' });
    expect(result).toEqual({ id: '1', name: 'Test' });
  });
});
