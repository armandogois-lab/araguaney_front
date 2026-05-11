import { fmtMoney2 } from '@/lib/format/money';
import { fmtPct } from '@/lib/format/percent';
import { fmtDate } from '@/lib/format/date';
import { daysSince } from '@/lib/format/cycle-day';
import type { CertificateDetail } from '@/lib/types/certificate';

interface Props {
  cert: CertificateDetail;
}

export function CertHeroStrip({ cert }: Props) {
  const merchantCount = new Set(cert.orders.map((o) => o.merchant.id)).size;
  const yieldFormatted = `${fmtMoney2(Number(cert.investor_yield))} al vencimiento`;
  const residualSub = `residual ${fmtMoney2(Number(cert.investor_returned))}`;
  const day = daysSince(cert.issue_date);

  let statusLabel = '';
  let statusSub = '';
  if (cert.status === 'issued') {
    statusLabel = '● Activo';
    statusSub = `día ${day} de ${cert.term_days}`;
  } else if (cert.status === 'matured') {
    statusLabel = '● Vencido';
    statusSub = `vencido ${fmtDate(cert.maturity_date)}`;
  } else if (cert.status === 'cancelled') {
    statusLabel = '● Cancelado';
    const at = cert.cancellation?.cancelled_at ?? cert.created_at;
    statusSub = `cancelado ${fmtDate(at)}`;
  } else {
    statusLabel = '● Borrador';
    statusSub = '';
  }

  return (
    <div className="bg-card border-border-subtle grid grid-cols-2 gap-4 rounded-xl border p-5 md:grid-cols-5">
      <Card label="CAPITAL" value={fmtMoney2(Number(cert.investor_capital))} sub={residualSub} />
      <Card label="TASA" value={fmtPct(cert.annual_rate)} sub={yieldFormatted} />
      <Card
        label="PLAZO"
        value={`${cert.term_days}d`}
        sub={`vence ${fmtDate(cert.maturity_date)}`}
      />
      <Card
        label="COMPOSICIÓN"
        value={String(cert.orders.length)}
        sub={`órdenes · ${merchantCount} comercios`}
      />
      <Card label="ESTADO" value={statusLabel} sub={statusSub} />
    </div>
  );
}

function Card({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <div className="text-text-3 mb-1 text-[10px] uppercase tracking-wide">{label}</div>
      <div className="text-[20px] font-semibold tabular-nums tracking-[-0.3px]">{value}</div>
      <div className="text-text-3 mt-0.5 text-[11px] tabular-nums">{sub}</div>
    </div>
  );
}
