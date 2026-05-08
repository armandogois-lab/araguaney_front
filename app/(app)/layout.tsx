import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { getCurrentUser } from '@/lib/auth/session';

// Force dynamic rendering for all (app) routes:
// 1. Auth gate via getCurrentUser() reads cookies; a static prerender would
//    bake in a "logged out" view.
// 2. Server Actions invoked from client components POST to the page URL.
//    Static pages return 405 to POST, so this also unblocks /batches uploads.
export const dynamic = 'force-dynamic';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/clear');
  return <AppShell user={user}>{children}</AppShell>;
}
