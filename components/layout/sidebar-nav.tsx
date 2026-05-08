'use client';

import { usePathname } from 'next/navigation';
import type { MeUser } from '@/lib/api/me';
import { NAV_SECTIONS } from '@/lib/nav/nav-config';
import { SidebarNavSection } from './sidebar-nav-section';

interface Props {
  role: MeUser['role'];
  className?: string;
}

export function SidebarNav({ role, className }: Props) {
  const pathname = usePathname();
  const visible = NAV_SECTIONS.filter((s) => s.allowedRoles.includes(role));

  return (
    <nav className={className}>
      {visible.map((section) => (
        <SidebarNavSection key={section.title} section={section} pathname={pathname} role={role} />
      ))}
    </nav>
  );
}
