import { Pill, type PillVariant } from '@/components/ui/pill';
import type { CertificateStatus } from '@/lib/types/certificate';

const MAP: Record<CertificateStatus, { variant: PillVariant; label: string }> = {
  draft: { variant: 'warn', label: 'Borrador pendiente' },
  issued: { variant: 'success', label: 'Activo' },
  matured: { variant: 'info', label: 'Vencido' },
  cancelled: { variant: 'danger', label: 'Cancelado' },
};

export function CertificateStatusPill({ status }: { status: CertificateStatus }) {
  const m = MAP[status];
  return <Pill variant={m.variant}>{m.label}</Pill>;
}
