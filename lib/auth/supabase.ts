import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { getEnv } from '@/lib/env';

export type SignInResult = { ok: true; accessToken: string } | { ok: false; error: string };

export async function signIn(email: string, password: string): Promise<SignInResult> {
  const env = getEnv();
  const client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await client.auth.signInWithPassword({ email, password });

  if (error) return { ok: false, error: error.message };
  if (!data.session) return { ok: false, error: 'Sign-in returned no session' };

  return { ok: true, accessToken: data.session.access_token };
}
