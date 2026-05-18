import { Pill, type PillVariant } from '@/components/ui/pill';
import type { OrderStatus } from '@/lib/types/order';

const MAP: Record<OrderStatus, { variant: PillVariant; label: string }> = {
  available: { variant: 'success', label: 'Disponible' },
  reserved: { variant: 'warn', label: 'Reservada' },
  assigned: { variant: 'info', label: 'Asignada' },
  matured: { variant: 'neutral', label: 'Vencida' },
  defaulted: { variant: 'danger', label: 'Defaulteada' },
};

export function OrderStatusPill({ status }: { status: OrderStatus }) {
  const m = MAP[status];
  return <Pill variant={m.variant}>{m.label}</Pill>;
}
