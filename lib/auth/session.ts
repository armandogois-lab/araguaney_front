import 'server-only';
import { getMe } from '@/lib/api/me';

export async function getCurrentUser() {
  try {
    return await getMe();
  } catch {
    return null;
  }
}
