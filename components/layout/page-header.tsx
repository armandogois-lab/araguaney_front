import { cn } from '@/lib/utils';

interface Props {
  breadcrumb: { section: string; current: string };
  title: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ breadcrumb, title, actions, className }: Props) {
  return (
    <div className={cn('mb-[22px] flex items-center justify-between', className)}>
      <div>
        <div className="text-text-3 mb-1.5 text-[11px]">
          {breadcrumb.section} · <b className="text-text font-medium">{breadcrumb.current}</b>
        </div>
        <h1 className="text-[22px] font-semibold leading-[1.2] tracking-[-0.4px]">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
