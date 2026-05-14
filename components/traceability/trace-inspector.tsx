'use client';

import { fmtDate } from '@/lib/format/date';
import { fmtMoney2 } from '@/lib/format/money';
import { fmtPct } from '@/lib/format/percent';
import type { CertificateOrder, CertificateSummary } from '@/lib/types/certificate';

interface Props {
  order: CertificateOrder;
  cert: CertificateSummary;
  payloadHash: string | null;
  onClose: () => void;
}

function truncateHash(h: string): string {
  if (h.length <= 16) return h;
  return `${h.slice(0, 8)}…${h.slice(-4)}`;
}

interface Step {
  label: string;
  title: string;
  sub: string;
}

export function TraceInspector({ order, cert, payloadHash, onClose }: Props) {
  const steps: Step[] = [
    {
      label: 'ORDEN',
      title: order.merchant.current_name,
      sub: `${order.merchant.rif} · ${order.installments.length} cuotas · ${fmtMoney2(Number(order.installments_sum_snapshot))}`,
    },
    {
      label: 'CERTIFICADO',
      title: cert.certificate_code,
      sub: `Emitido ${fmtDate(cert.issue_date)} · ${cert.term_days}d @ ${fmtPct(cert.annual_rate)}`,
    },
    {
      label: 'INVERSOR',
      title: cert.investor.legal_name,
      sub: cert.investor.rif,
    },
    {
      label: 'EMITIDO POR',
      title: cert.issued_by.full_name,
      sub: 'Tesorería · usuario emisor',
    },
  ];

  return (
    <div className="bg-card border-border-subtle sticky top-4 rounded-xl border p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-text-3 mb-0.5 text-[10px] uppercase tracking-wide">
            Cadena de auditoría
          </div>
          <div className="font-mono text-[14px] font-semibold">{order.external_order_id}</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="bg-subtle text-text-2 flex h-6 w-6 items-center justify-center rounded-md text-[13px]"
        >
          ×
        </button>
      </div>

      <div className="relative">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <div key={step.label} className={'relative flex gap-3 ' + (isLast ? '' : 'pb-4')}>
              {!isLast && (
                <span className="bg-border-strong absolute top-3.5 bottom-0 left-[7px] w-px" />
              )}
              <span
                className={
                  'border-text-2 relative z-10 mt-0.5 inline-block h-3.5 w-3.5 flex-shrink-0 rounded-full border-[1.5px] ' +
                  (isLast ? 'bg-text-2' : 'bg-card')
                }
              />
              <div className="min-w-0 flex-1">
                <div className="text-text-3 mb-0.5 text-[9.5px] uppercase tracking-wider">
                  {step.label}
                </div>
                <div className="text-[12.5px] font-medium leading-snug">{step.title}</div>
                <div className="text-text-3 mt-0.5 text-[10.5px] tabular-nums">{step.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-subtle text-text-2 mt-4 rounded-md px-3 py-2 text-[10px]">
        {payloadHash ? (
          <>
            <span className="text-text-3 mr-2 uppercase tracking-wider">HASH</span>
            <span className="font-mono">·</span>{' '}
            <span className="font-mono">{truncateHash(payloadHash)}</span>
          </>
        ) : (
          <span>HASH · —</span>
        )}
      </div>
    </div>
  );
}
