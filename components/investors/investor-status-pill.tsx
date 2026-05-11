import { Pill, type PillVariant } from '@/components/ui/pill';
import type { InvestorStatus } from '@/lib/types/investor';

const MAP: Record<InvestorStatus, { variant: PillVariant; label: string }> = {
  active: { variant: 'success', label: 'Activo' },
  inactive: { variant: 'neutral', label: 'Inactivo' },
};

export function InvestorStatusPill({ status }: { status: InvestorStatus }) {
  const m = MAP[status];
  return <Pill variant={m.variant}>{m.label}</Pill>;
}
