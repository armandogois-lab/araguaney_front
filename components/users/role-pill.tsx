import { Pill, type PillVariant } from '@/components/ui/pill';
import type { UserRole } from '@/lib/types/user';

interface Props {
  role: UserRole;
}

const LABEL: Record<UserRole, string> = {
  admin: 'Admin',
  auditor: 'Auditor',
  operator: 'Operador',
};

const VARIANT: Record<UserRole, PillVariant> = {
  admin: 'info',
  auditor: 'warn',
  operator: 'neutral',
};

export function RolePill({ role }: Props) {
  return <Pill variant={VARIANT[role]}>{LABEL[role]}</Pill>;
}
