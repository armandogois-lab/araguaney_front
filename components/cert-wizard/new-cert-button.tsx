'use client';

import { hasPermission } from '@/lib/permissions/has-permission';
import { useUser } from '@/lib/auth/user-context';

interface Props {
  onClick: () => void;
}

export function NewCertButton({ onClick }: Props) {
  const user = useUser();
  if (!hasPermission(user.role, 'certificate.simulate')) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-foreground text-background rounded-md px-4 py-2 text-[12px] font-medium hover:opacity-90"
    >
      + Nuevo certificado
    </button>
  );
}
