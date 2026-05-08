import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

/**
 * Browser-side Supabase client used solely for `uploadToSignedUrl`. The
 * signed URL minted by the back already carries its own auth token, so the
 * anon key here is just to satisfy the SDK signature — no user JWT is read
 * from the browser.
 */
export function getBrowserSupabase(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      'Falta configuración de Supabase: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY',
    );
  }
  cached = createClient(url, anon, { auth: { persistSession: false } });
  return cached;
}
