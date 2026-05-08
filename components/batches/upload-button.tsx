'use client';

import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/auth/user-context';
import { hasPermission } from '@/lib/permissions/has-permission';

export function UploadButton({ onClick }: { onClick: () => void }) {
  const user = useUser();
  if (!hasPermission(user.role, 'batch.upload')) return null;
  return <Button onClick={onClick}>Subir lote</Button>;
}
