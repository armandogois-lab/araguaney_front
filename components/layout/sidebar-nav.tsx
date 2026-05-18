'use client';

import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import type { MeUser } from '@/lib/api/me';
import { NAV_SECTIONS } from '@/lib/nav/nav-config';
import { listCertificates } from '@/lib/api/certificates';
import { SidebarNavSection } from './sidebar-nav-section';

interface Props {
  role: MeUser['role'];
  className?: string;
}

export function SidebarNav({ role, className }: Props) {
  const pathname = usePathname();
  const isAdmin = role === 'admin';

  const draftsQ = useQuery({
    queryKey: ['certificates-drafts-count'],
    queryFn: () => listCertificates({ status: 'draft', limit: 1 }).then((r) => r.total),
    staleTime: 30_000,
    enabled: isAdmin,
  });
  const draftCount = isAdmin ? (draftsQ.data ?? 0) : 0;

  const badgeMap: Record<string, number> = { certificates: draftCount };
  const visible = NAV_SECTIONS.filter((s) => s.allowedRoles.includes(role));

  return (
    <nav className={className}>
      {visible.map((section) => (
        <SidebarNavSection
          key={section.title}
          section={section}
          pathname={pathname}
          role={role}
          badgeMap={badgeMap}
        />
      ))}
    </nav>
  );
}
