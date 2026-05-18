'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getCertificateDetail } from '@/lib/api/certificates';
import { useUser } from '@/lib/auth/user-context';
import { hasPermission } from '@/lib/permissions/has-permission';
import { CertHeader } from './cert-header';
import { CertHeroStrip } from './cert-hero-strip';
import { CertOrdersTable } from './cert-orders-table';
import { CertAuditSidebar } from './cert-audit-sidebar';
import { CancelCertModal } from './cancel-cert-modal';
import { ApproveDraftModal } from './approve-draft-modal';

interface Props {
  id: string;
}

export function CertificateDetailPage({ id }: Props) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const user = useUser();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['certificate', id],
    queryFn: () => getCertificateDetail(id),
    staleTime: 30 * 1000,
  });

  async function handleExport() {
    if (!data || exporting) return;
    setExporting(true);
    try {
      const [{ generateCertificateExcel }, { saveAs }] = await Promise.all([
        import('@/lib/export/certificate-excel'),
        import('file-saver'),
      ]);
      const blob = await generateCertificateExcel(data);
      const filename = `Certificado_${data.certificate_code ?? 'borrador'}_${data.issue_date}.xlsx`;
      saveAs(blob, filename);
      toast.success('Excel exportado');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo generar el archivo');
    } finally {
      setExporting(false);
    }
  }

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

  const isDraft = data.status === 'draft';
  const isIssued = data.status === 'issued';
  const isCreator = data.issued_by?.id === user.id;
  const canApprove = isDraft && hasPermission(user.role, 'certificate.approve');
  const canCancelDraft = isDraft && (isCreator || user.role === 'admin');
  const canCancelIssued = isIssued && hasPermission(user.role, 'certificate.cancel');

  return (
    <div className="mx-auto w-full max-w-[1440px] px-9 py-7">
      <CertHeader
        cert={data}
        onCancel={() => setCancelOpen(true)}
        onExport={handleExport}
        exporting={exporting}
      />
      {(canApprove || canCancelDraft) && (
        <div className="mt-3 flex gap-2">
          {canApprove && (
            <button
              type="button"
              onClick={() => setApproveOpen(true)}
              className="bg-green-bg text-green-text rounded-md px-3 py-1.5 text-[12px] font-medium"
            >
              Aprobar
            </button>
          )}
          {canCancelDraft && (
            <button
              type="button"
              onClick={() => setCancelOpen(true)}
              className="text-warn-text border-warn-border rounded-md border px-3 py-1.5 text-[12px]"
            >
              Cancelar borrador
            </button>
          )}
        </div>
      )}
      {canCancelIssued &&
        !canCancelDraft &&
        // For issued certs, cancel is surfaced through CertHeader's button.
        // This hidden div keeps the modal wired for issued-cancel triggered from header.
        null}
      <div className="mt-5 flex flex-col gap-5">
        <CertHeroStrip cert={data} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_320px]">
          <CertOrdersTable orders={data.orders} />
          <CertAuditSidebar cert={data} />
        </div>
      </div>
      {cancelOpen && (
        <CancelCertModal
          cert={{
            id: data.id,
            certificate_code: data.certificate_code,
            status: data.status,
            order_count: data.orders.length,
          }}
          onClose={() => setCancelOpen(false)}
        />
      )}
      {approveOpen && (
        <ApproveDraftModal
          certId={data.id}
          orderCount={data.orders?.length ?? 0}
          nominalActual={data.nominal_actual}
          onClose={() => setApproveOpen(false)}
        />
      )}
    </div>
  );
}
