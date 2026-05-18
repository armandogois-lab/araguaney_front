'use client';

import Link from 'next/link';
import { fmtDate, fmtDateTime } from '@/lib/format/date';
import { hasPermission } from '@/lib/permissions/has-permission';
import { useUser } from '@/lib/auth/user-context';
import type { CertificateDetail } from '@/lib/types/certificate';
import { CertificateStatusPill } from './certificate-status-pill';

function timeUntilExpiry(createdAtIso: string): string {
  const expiresAt = new Date(createdAtIso).getTime() + 24 * 3600 * 1000;
  const ms = expiresAt - Date.now();
  if (ms <= 0) return 'expirado';
  const hours = Math.floor(ms / (3600 * 1000));
  const mins = Math.floor((ms % (3600 * 1000)) / 60000);
  return `${hours}h ${mins}m`;
}

interface Props {
  cert: CertificateDetail;
  onCancel: () => void;
  onExport?: () => void;
  exporting?: boolean;
}

export function CertHeader({ cert, onCancel, onExport, exporting = false }: Props) {
  const user = useUser();
  const canCancel = hasPermission(user.role, 'certificate.cancel') && cert.status === 'issued';

  const certCode = cert.certificate_code ?? '—';

  let subText: React.ReactNode;
  if (cert.status === 'draft') {
    subText = (
      <>
        Creado por {cert.issued_by.full_name} · {fmtDateTime(cert.created_at)} · expira en{' '}
        {timeUntilExpiry(cert.created_at)}
      </>
    );
  } else if (cert.status === 'issued' && cert.approved_by) {
    subText = (
      <>
        Aprobado por {cert.approved_by.full_name} · {fmtDateTime(cert.approved_at ?? undefined)}
      </>
    );
  } else {
    subText = (
      <>
        Emitido {fmtDate(cert.issue_date)} por {cert.issued_by.full_name} ·{' '}
        <span className="font-mono">{cert.investor.rif}</span>
      </>
    );
  }

  return (
    <div>
      <div className="text-text-3 mb-2 text-[12px]">
        <Link href="/" className="hover:underline">
          Operación
        </Link>{' '}
        ·{' '}
        <Link href="/certificates" className="hover:underline">
          Certificados
        </Link>{' '}
        · <b className="text-text-2 font-mono font-medium">{certCode}</b>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-[22px] font-semibold tracking-[-0.3px]">
              {cert.investor.legal_name}
            </h1>
            <span className="bg-subtle text-text-2 rounded-md px-2 py-0.5 font-mono text-[12px]">
              {certCode}
            </span>
            <CertificateStatusPill status={cert.status} />
          </div>
          <div className="text-text-3 text-[12px]">{subText}</div>
        </div>
        <div className="flex items-center gap-2">
          {onExport && (
            <button
              type="button"
              onClick={onExport}
              disabled={exporting}
              className="border-border-subtle bg-card text-text-2 hover:bg-subtle rounded-md border px-4 py-2 text-[12px] font-medium disabled:opacity-40"
            >
              {exporting ? 'Generando…' : 'Exportar Excel'}
            </button>
          )}
          {canCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="border-border-subtle bg-card text-text-2 hover:bg-subtle rounded-md border px-4 py-2 text-[12px] font-medium"
            >
              Cancelar certificado
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
