'use client';

import { Pill } from '@/components/ui/pill';
import { CertificateStatusPill } from '@/components/certificates/certificate-status-pill';
import { fmtDate } from '@/lib/format/date';
import { fmtMoney2 } from '@/lib/format/money';
import { fmtPct } from '@/lib/format/percent';
import type { CertificateSummary } from '@/lib/types/certificate';

interface Props {
  cert: CertificateSummary;
  expanded: boolean;
  onToggle: (certId: string) => void;
}

export function TraceCertRow({ cert, expanded, onToggle }: Props) {
  return (
    <div
      onClick={() => onToggle(cert.id)}
      className={
        'grid cursor-pointer items-center gap-4 px-5 py-3.5 ' +
        'grid-cols-[18px_1.2fr_1.6fr_1fr_1fr_100px] ' +
        (expanded ? 'bg-subtle border-border-subtle border-b' : 'bg-transparent hover:bg-subtle')
      }
    >
      <span
        className="text-text-3 inline-block font-mono text-[10px] transition-transform"
        style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
      >
        ▸
      </span>
      <div>
        <div className="text-text-2 font-mono text-[12px] font-medium">{cert.certificate_code}</div>
        <div className="text-text-3 mt-0.5 text-[10px] tabular-nums">
          {fmtMoney2(Number(cert.investor_capital))} · {cert.term_days}d @{' '}
          {fmtPct(cert.annual_rate)}
        </div>
      </div>
      <div>
        <div className="text-text-3 mb-0.5 text-[11px]">Inversor</div>
        <div className="text-[12px] font-medium">{cert.investor.legal_name}</div>
        <div className="text-text-3 font-mono text-[10px]">{cert.investor.rif}</div>
      </div>
      <div>
        <div className="text-text-3 mb-0.5 text-[11px]">Emitido por</div>
        <div className="text-[12px]">{cert.issued_by.full_name}</div>
        <div className="text-text-3 text-[10px] tabular-nums">{fmtDate(cert.issue_date)}</div>
      </div>
      <div>
        <div className="text-text-3 mb-0.5 text-[11px]">Vencimiento</div>
        <div className="text-[12px] tabular-nums">{fmtDate(cert.maturity_date)}</div>
      </div>
      <div className="text-right">
        {cert.certificate_type === 'sweep' ? (
          <Pill variant="sweep">Barrido Cashea</Pill>
        ) : (
          <CertificateStatusPill status={cert.status} />
        )}
      </div>
    </div>
  );
}
