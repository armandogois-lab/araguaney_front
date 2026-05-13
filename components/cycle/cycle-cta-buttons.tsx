'use client';

import Link from 'next/link';
import type { MeUser } from '@/lib/api/me';
import { hasPermission } from '@/lib/permissions/has-permission';

interface Props {
  userRole: MeUser['role'];
}

export function CycleCtaButtons({ userRole }: Props) {
  const canUpload = hasPermission(userRole, 'batch.upload');
  const canCreateCert = hasPermission(userRole, 'certificate.create');

  if (!canUpload && !canCreateCert) return null;

  return (
    <div className="flex items-center gap-2">
      {canUpload && (
        <Link
          href="/batches"
          className="border-border-subtle bg-card text-text-2 hover:bg-subtle rounded-md border px-4 py-2 text-[12px] font-medium"
        >
          Subir lote
        </Link>
      )}
      {canCreateCert && (
        <Link
          href="/stock"
          className="bg-foreground text-background rounded-md px-4 py-2 text-[12px] font-medium"
        >
          Nuevo certificado
        </Link>
      )}
    </div>
  );
}
