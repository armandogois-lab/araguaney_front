'use client';

import type { UseQueryResult } from '@tanstack/react-query';
import type { CertificatesListResponse } from '@/lib/types/certificate';

interface Props {
  certsQ: UseQueryResult<CertificatesListResponse>;
}

export function TraceKpiStrip({ certsQ }: Props) {
  if (certsQ.isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <CardSkeleton label="Certificados emitidos" />
        <CardSkeleton label="Inversores con cobertura" />
        <CardSkeleton label="Usuarios emisores" />
      </div>
    );
  }
  if (certsQ.isError || !certsQ.data) {
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <CardError label="Certificados emitidos" />
        <CardError label="Inversores con cobertura" />
        <CardError label="Usuarios emisores" />
      </div>
    );
  }
  const certs = certsQ.data.data;
  const investors = new Set(certs.map((c) => c.investor.id));
  const emisores = Array.from(new Set(certs.map((c) => c.issued_by.full_name)));

  const emisoresValue =
    emisores.length === 0
      ? '0'
      : emisores.slice(0, 2).join(' · ') + (emisores.length > 2 ? ' · …' : '');
  const emisoresSub = emisores.length === 0 ? 'sin emisores' : `${emisores.length} en la muestra`;

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <Card label="Certificados emitidos" value={String(certsQ.data.total)} sub="en el período" />
      <Card
        label="Inversores con cobertura"
        value={String(investors.size)}
        sub="únicos con orden asignada"
      />
      <Card label="Usuarios emisores" value={emisoresValue} sub={emisoresSub} />
    </div>
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
