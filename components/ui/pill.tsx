import { cn } from '@/lib/utils';

export type PillVariant = 'success' | 'warn' | 'info' | 'neutral' | 'sweep';

interface Props {
  variant?: PillVariant;
  children: React.ReactNode;
  className?: string;
}

const VARIANT_CLASSES: Record<PillVariant, string> = {
  success: 'bg-green-bg text-green-text',
  warn: 'bg-warn-bg text-warn-text',
  info: 'bg-info-bg text-info-text',
  neutral: 'bg-neutral-bg text-neutral-text',
  sweep: 'bg-sweep-bg text-sweep-text border border-dashed border-sweep-border',
};

const DOT_CLASSES: Record<PillVariant, string> = {
  success: 'bg-green-dot',
  warn: 'bg-warn-dot',
  info: 'bg-info-text',
  neutral: 'bg-text-3',
  sweep: 'bg-sweep-dot',
};

export function Pill({ variant = 'neutral', children, className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[11px] font-medium leading-[1.4]',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      <span className={cn('h-[5px] w-[5px] rounded-full', DOT_CLASSES[variant])} />
      {children}
    </span>
  );
}
