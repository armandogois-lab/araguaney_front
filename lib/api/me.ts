import 'server-only';
import { apiFetch } from './client';

// The /api/me response shape. The openapi.d.ts has content?: never for this
// endpoint's 200 response (the backend returns the user object without a
// declared schema), so we define the type manually here.
export interface MeUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export async function getMe(): Promise<MeUser> {
  return apiFetch<MeUser>('/api/me', { method: 'GET' });
}
