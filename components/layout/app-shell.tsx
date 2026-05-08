import type { MeUser } from '@/lib/api/me';
import { Sidebar } from './sidebar';

interface Props {
  user: MeUser;
  children: React.ReactNode;
}

export function AppShell({ user, children }: Props) {
  return (
    <div className="grid min-h-screen grid-cols-[220px_1fr]">
      <Sidebar user={user} />
      <main className="flex min-w-0 flex-col">{children}</main>
    </div>
  );
}
