import { logoutAction } from '@/app/(app)/logout/actions';
import type { MeUser } from '@/lib/api/me';
import { SidebarLogo } from './sidebar-logo';
import { SidebarNav } from './sidebar-nav';
import { SidebarUser } from './sidebar-user';

interface Props {
  user: MeUser;
}

export function Sidebar({ user }: Props) {
  return (
    <aside className="bg-side text-side-text sticky top-0 flex h-screen w-[220px] flex-col px-3 py-5">
      <div className="mb-6">
        <SidebarLogo />
      </div>

      <SidebarNav role={user.role} className="flex-1 overflow-y-auto" />

      <div className="mt-2 border-t border-white/[0.08] pt-3.5">
        <SidebarUser user={user} />
        <form action={logoutAction}>
          <button
            type="submit"
            className="hover:bg-side-hover mt-2 w-full rounded-md px-2 py-1.5 text-left text-[11px] text-white/45 transition-colors hover:text-white"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
