import { describe, it, expect } from 'vitest';
import { envSchema } from './env';

describe('envSchema', () => {
  const valid = {
    NEXT_PUBLIC_API_URL: 'http://localhost:3001/api',
  };

  it('parses a minimal valid env', () => {
    const r = envSchema.parse(valid);
    expect(r.NEXT_PUBLIC_API_URL).toBe('http://localhost:3001/api');
  });

  it('rejects missing NEXT_PUBLIC_API_URL', () => {
    expect(() => envSchema.parse({})).toThrow();
  });

  it('rejects malformed NEXT_PUBLIC_API_URL', () => {
    expect(() => envSchema.parse({ NEXT_PUBLIC_API_URL: 'not-a-url' })).toThrow();
  });
});
