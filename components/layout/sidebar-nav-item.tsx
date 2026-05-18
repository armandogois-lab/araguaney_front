import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Props {
  label: string;
  href: string;
  active: boolean;
  badge?: number;
}

export function SidebarNavItem({ label, href, active, badge }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        'relative mb-px flex items-center gap-2.5 rounded-[7px] px-3 py-[9px] text-[13px] transition-colors',
        active
          ? 'bg-side-active text-white'
          : 'text-side-text hover:bg-side-hover hover:text-white',
      )}
    >
      {active && <span className="bg-yellow absolute top-1.5 bottom-1.5 left-0 w-0.5 rounded-sm" />}
      <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-white/40" />
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-warn-bg text-warn-text ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium tabular-nums">
          {badge}
        </span>
      )}
    </Link>
  );
}
