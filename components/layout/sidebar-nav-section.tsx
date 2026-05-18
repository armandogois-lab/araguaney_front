import type { MeUser } from '@/lib/api/me';
import type { NavSection } from '@/lib/nav/nav-config';
import { SidebarNavItem } from './sidebar-nav-item';

interface Props {
  section: NavSection;
  pathname: string;
  role: MeUser['role'];
  /** Map from nav item key to badge count. */
  badgeMap?: Record<string, number>;
}

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + '/');
}

export function SidebarNavSection({ section, pathname, role, badgeMap }: Props) {
  const items = section.items.filter(
    (item) => !item.allowedRoles || item.allowedRoles.includes(role),
  );
  if (items.length === 0) return null;

  return (
    <div className="mb-[18px]">
      <div className="mb-1.5 px-3 text-[10px] font-medium tracking-[0.7px] text-white/35 uppercase">
        {section.title}
      </div>
      <div>
        {items.map((item) => (
          <SidebarNavItem
            key={item.key}
            label={item.label}
            href={item.href}
            active={isActive(pathname, item.href)}
            badge={badgeMap?.[item.key]}
          />
        ))}
      </div>
    </div>
  );
}
