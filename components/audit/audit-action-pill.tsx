import { Pill, type PillVariant } from '@/components/ui/pill';

const MAP: Record<string, { variant: PillVariant; label: string }> = {
  create: { variant: 'success', label: 'Crear' },
  update: { variant: 'info', label: 'Actualizar' },
  cancel: { variant: 'danger', label: 'Cancelar' },
  grant: { variant: 'success', label: 'Otorgar' },
  revoke: { variant: 'warn', label: 'Revocar' },
};

export function AuditActionPill({ action }: { action: string }) {
  const m = MAP[action] ?? { variant: 'neutral' as PillVariant, label: action };
  return <Pill variant={m.variant}>{m.label}</Pill>;
}
