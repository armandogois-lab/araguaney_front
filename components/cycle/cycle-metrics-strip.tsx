'use client';

import Link from 'next/link';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fmtMoney2 } from '@/lib/format/money';
import type { OrdersStats } from '@/lib/types/order';
import type { CertificatesListResponse } from '@/lib/types/certificate';
import { listCertificates } from '@/lib/api/certificates';

interface Props {
  statsQ: UseQueryResult<OrdersStats>;
  certsQ: UseQueryResult<CertificatesListResponse>;
}

export function CycleMetricsStrip({ statsQ, certsQ }: Props) {
  const draftsCountQ = useQuery({
    queryKey: ['certificates-drafts-count'],
    queryFn: () => listCertificates({ status: 'draft', limit: 1 }).then((r) => r.total),
    staleTime: 30_000,
  });
  const draftCount = draftsCountQ.data ?? 0;

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-4">
      <StockCard q={statsQ} />
      <AsignadoCard q={certsQ} />
      <InvestorsCard q={certsQ} />
      <Link
        href="/certificates?status=draft"
        className="bg-warn-bg text-warn-text border-warn-border rounded-xl border px-4 py-3 hover:opacity-80"
      >
        <div className="text-[10px] uppercase tracking-wide">Borradores pendientes</div>
        <div className="text-[18px] font-semibold tabular-nums">
          {draftCount.toLocaleString('en-US')}
        </div>
      </Link>
    </div>
  );
}

function StockCard({ q }: { q: UseQueryResult<OrdersStats> }) {
  if (q.isLoading) return <CardSkeleton label="Stock disponible" />;
  if (q.isError || !q.data) return <CardError label="Stock disponible" />;
  const count = q.data.by_status.available.count;
  const capital = Number(q.data.available_capital);
  return (
    <Card
      label="Stock disponible"
      value={count > 0 ? fmtMoney2(capital) : '—'}
      sub={`${count.toLocaleString('en-US')} órdenes`}
    />
  );
}

function AsignadoCard({ q }: { q: UseQueryResult<CertificatesListResponse> }) {
  if (q.isLoading) return <CardSkeleton label="Asignado esta semana" />;
  if (q.isError || !q.data) return <CardError label="Asignado esta semana" />;
  const sum = q.data.data.reduce((acc, c) => acc + Number(c.investor_capital), 0);
  const plural = q.data.total === 1 ? '' : 's';
  return (
    <Card
      label="Asignado esta semana"
      value={fmtMoney2(sum)}
      sub={`${q.data.total} certificado${plural} emitido${plural}`}
    />
  );
}

function InvestorsCard({ q }: { q: UseQueryResult<CertificatesListResponse> }) {
  if (q.isLoading) return <CardSkeleton label="Inversores activos" />;
  if (q.isError || !q.data) return <CardError label="Inversores activos" />;
  const distinct = new Set(q.data.data.map((c) => c.investor.id)).size;
  return (
    <Card label="Inversores activos" value={String(distinct)} sub="con cert emitido esta semana" />
  );
}

function Card({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-card border-border-subtle rounded-xl border p-5">
      <div className="text-text-3 mb-1 text-[10px] uppercase tracking-wide">{label}</div>
      <div className="text-[20px] font-semibold tabular-nums tracking-[-0.3px]">{value}</div>
      <div className="text-text-3 mt-0.5 text-[11px] tabular-nums">{sub}</div>
    </div>
  );
}

function CardSkeleton({ label }: { label: string }) {
  return (
    <div className="bg-card border-border-subtle rounded-xl border p-5">
      <div className="text-text-3 mb-1 text-[10px] uppercase tracking-wide">{label}</div>
      <div className="text-text-3 text-[12px] italic">Cargando…</div>
    </div>
  );
}

function CardError({ label }: { label: string }) {
  return (
    <div className="bg-card border-border-subtle rounded-xl border p-5">
      <div className="text-text-3 mb-1 text-[10px] uppercase tracking-wide">{label}</div>
      <div className="text-warn-text text-[12px]">No se pudo cargar.</div>
    </div>
  );
}
