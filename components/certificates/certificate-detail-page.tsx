'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getCertificateDetail } from '@/lib/api/certificates';
import { CertHeader } from './cert-header';
import { CertHeroStrip } from './cert-hero-strip';
import { CertOrdersTable } from './cert-orders-table';
import { CertAuditSidebar } from './cert-audit-sidebar';
import { CancelCertModal } from './cancel-cert-modal';

interface Props {
  id: string;
}

export function CertificateDetailPage({ id }: Props) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['certificate', id],
    queryFn: () => getCertificateDetail(id),
    staleTime: 30 * 1000,
  });

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1440px] px-9 py-7">
        <div className="text-text-3 py-24 text-center text-sm">Cargando certificado…</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto w-full max-w-[1440px] px-9 py-7">
        <div className="border-border-subtle bg-card flex flex-col items-center gap-3 rounded-xl border py-24">
          <div className="text-text-2 text-sm">Certificado no encontrado.</div>
          <Link
            href="/certificates"
            className="border-border-subtle rounded border px-3 py-1 text-[12px]"
          >
            Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-9 py-7">
      <CertHeader cert={data} onCancel={() => setCancelOpen(true)} />
      <div className="mt-5 flex flex-col gap-5">
        <CertHeroStrip cert={data} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_320px]">
          <CertOrdersTable orders={data.orders} />
          <CertAuditSidebar cert={data} />
        </div>
      </div>
      {cancelOpen && (
        <CancelCertModal
          certId={data.id}
          certCode={data.certificate_code}
          orderCount={data.orders.length}
          onClose={() => setCancelOpen(false)}
        />
      )}
    </div>
  );
}
