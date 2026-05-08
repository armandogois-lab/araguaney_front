import { cn } from '@/lib/utils';
import type { MeUser } from '@/lib/api/me';

const ROLE_LABELS: Record<MeUser['role'], string> = {
  operator: 'Tesorería',
  admin: 'Administración',
  auditor: 'Auditoría',
};

function initials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
}

interface Props {
  user: MeUser;
  className?: string;
}

export function SidebarUser({ user, className }: Props) {
  return (
    <div className={cn('flex items-center gap-2.5 px-2', className)}>
      <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white/10 text-[11px] font-medium text-white">
        {initials(user.full_name)}
      </div>
      <div className="leading-[1.2]">
        <div className="text-xs font-medium text-white">{user.full_name}</div>
        <div className="text-[10px] text-white/50">{ROLE_LABELS[user.role]}</div>
      </div>
    </div>
  );
}
