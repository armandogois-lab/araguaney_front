import type { MeUser } from '@/lib/api/me';
import { UserProvider } from '@/lib/auth/user-context';
import { Sidebar } from './sidebar';

interface Props {
  user: MeUser;
  children: React.ReactNode;
}

export function AppShell({ user, children }: Props) {
  return (
    <div className="grid min-h-screen grid-cols-[220px_1fr]">
      <Sidebar user={user} />
      <main className="flex min-w-0 flex-col">
        <UserProvider user={user}>{children}</UserProvider>
      </main>
    </div>
  );
}
