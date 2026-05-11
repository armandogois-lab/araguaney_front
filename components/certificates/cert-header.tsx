'use client';

import Link from 'next/link';
import { fmtDate } from '@/lib/format/date';
import { hasPermission } from '@/lib/permissions/has-permission';
import { useUser } from '@/lib/auth/user-context';
import type { CertificateDetail } from '@/lib/types/certificate';
import { CertificateStatusPill } from './certificate-status-pill';

interface Props {
  cert: CertificateDetail;
  onCancel: () => void;
}

export function CertHeader({ cert, onCancel }: Props) {
  const user = useUser();
  const canCancel = hasPermission(user.role, 'certificate.cancel') && cert.status === 'issued';

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
        · <b className="text-text-2 font-mono font-medium">{cert.certificate_code}</b>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-[22px] font-semibold tracking-[-0.3px]">
              {cert.investor.legal_name}
            </h1>
            <span className="bg-subtle text-text-2 rounded-md px-2 py-0.5 font-mono text-[12px]">
              {cert.certificate_code}
            </span>
            <CertificateStatusPill status={cert.status} />
          </div>
          <div className="text-text-3 text-[12px]">
            Emitido {fmtDate(cert.issue_date)} por {cert.issued_by.full_name} ·{' '}
            <span className="font-mono">{cert.investor.rif}</span>
          </div>
        </div>
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
  );
}
