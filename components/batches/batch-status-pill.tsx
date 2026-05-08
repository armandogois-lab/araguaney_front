import { Pill, type PillVariant } from '@/components/ui/pill';
import type { BatchStatus } from '@/lib/types/batch';

const MAP: Record<BatchStatus, { variant: PillVariant; label: string }> = {
  imported: { variant: 'success', label: 'Activo' },
  uploaded: { variant: 'info', label: 'Subido' },
  parsing: { variant: 'info', label: 'Procesando' },
  rejected: { variant: 'warn', label: 'Rechazado' },
  archived: { variant: 'neutral', label: 'Archivado' },
};

export function BatchStatusPill({ status }: { status: BatchStatus }) {
  const m = MAP[status];
  return <Pill variant={m.variant}>{m.label}</Pill>;
}
