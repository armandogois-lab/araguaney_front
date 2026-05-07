import { describe, it, expect } from 'vitest';
import { envSchema } from './env';

describe('envSchema', () => {
  const valid = {
    NEXT_PUBLIC_API_URL: 'http://localhost:3001/api',
    NEXT_PUBLIC_SUPABASE_URL: 'https://abc.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJabc',
  };

  it('parses a minimal valid env', () => {
    const r = envSchema.parse(valid);
    expect(r.NEXT_PUBLIC_API_URL).toBe('http://localhost:3001/api');
    expect(r.NEXT_PUBLIC_SUPABASE_URL).toBe('https://abc.supabase.co');
    expect(r.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe('eyJabc');
  });

  it('rejects missing NEXT_PUBLIC_API_URL', () => {
    const { NEXT_PUBLIC_API_URL: _, ...rest } = valid;
    expect(() => envSchema.parse(rest)).toThrow();
  });

  it('rejects malformed NEXT_PUBLIC_API_URL', () => {
    expect(() => envSchema.parse({ ...valid, NEXT_PUBLIC_API_URL: 'not-a-url' })).toThrow();
  });

  it('rejects missing NEXT_PUBLIC_SUPABASE_URL', () => {
    const { NEXT_PUBLIC_SUPABASE_URL: _, ...rest } = valid;
    expect(() => envSchema.parse(rest)).toThrow();
  });

  it('rejects malformed NEXT_PUBLIC_SUPABASE_URL', () => {
    expect(() => envSchema.parse({ ...valid, NEXT_PUBLIC_SUPABASE_URL: 'not-a-url' })).toThrow();
  });

  it('rejects empty NEXT_PUBLIC_SUPABASE_ANON_KEY', () => {
    expect(() => envSchema.parse({ ...valid, NEXT_PUBLIC_SUPABASE_ANON_KEY: '' })).toThrow();
  });
});
