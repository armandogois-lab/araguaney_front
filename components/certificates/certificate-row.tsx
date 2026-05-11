'use client';

import { useRouter } from 'next/navigation';
import { fmtDate } from '@/lib/format/date';
import { fmtMoney2 } from '@/lib/format/money';
import type { CertificateSummary } from '@/lib/types/certificate';
import { CertificateStatusPill } from './certificate-status-pill';

export function CertificateRow({ cert }: { cert: CertificateSummary }) {
  const router = useRouter();
  return (
    <tr
      onClick={() => router.push(`/certificates/${cert.id}`)}
      className="border-border-soft hover:bg-subtle cursor-pointer border-b transition-colors"
    >
      <td className="text-text-2 px-4 py-3.5 font-mono text-[11.5px]">{cert.certificate_code}</td>
      <td className="max-w-[280px] truncate px-4 py-3.5" title={cert.investor.legal_name}>
        {cert.investor.legal_name}
      </td>
      <td className="num px-4 py-3.5">{fmtDate(cert.issue_date)}</td>
      <td className="num px-4 py-3.5">{fmtDate(cert.maturity_date)}</td>
      <td className="num px-4 py-3.5 text-right font-medium">
        {fmtMoney2(Number(cert.investor_capital))}
      </td>
      <td className="px-4 py-3.5">
        <CertificateStatusPill status={cert.status} />
      </td>
    </tr>
  );
}
