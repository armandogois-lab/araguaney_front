'use client';

import { useQuery } from '@tanstack/react-query';
import { listCertificates, type ListCertificatesQuery } from '@/lib/api/certificates';
import { CertificateRow } from './certificate-row';
import type { CertificateFiltersValue } from './certificate-filters';

const PAGE_LIMIT = 50;

interface Props {
  filters: CertificateFiltersValue;
  page: number;
  onPageChange: (next: number) => void;
}

function buildQuery(filters: CertificateFiltersValue, page: number): ListCertificatesQuery {
  return {
    limit: PAGE_LIMIT,
    offset: page * PAGE_LIMIT,
    status: filters.status === 'all' ? undefined : filters.status,
    investor_id: filters.investorId ?? undefined,
    issue_date_from: filters.issueDateFrom ?? undefined,
    issue_date_to: filters.issueDateTo ?? undefined,
    q: filters.q || undefined,
    sort: 'issue_date_desc',
  };
}

export function CertificatesTable({ filters, page, onPageChange }: Props) {
  const query = buildQuery(filters, page);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['certificates', query],
    queryFn: () => listCertificates(query),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <Skeleton />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!data || data.data.length === 0) return <EmptyState />;

  const start = data.offset + 1;
  const end = Math.min(data.offset + data.limit, data.total);
  const hasPrev = page > 0;
  const hasNext = data.offset + data.limit < data.total;

  return (
    <div className="bg-card border-border-subtle overflow-hidden rounded-xl border">
      <table className="w-full text-[12.5px]">
        <thead className="bg-subtle">
          <tr>
            <Th>Código</Th>
            <Th>Inversor</Th>
            <Th>Emitido</Th>
            <Th>Vence</Th>
            <Th align="right">Capital</Th>
            <Th>Estado</Th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((c) => (
            <CertificateRow key={c.id} cert={c} />
          ))}
        </tbody>
      </table>
      <div className="border-border-subtle flex items-center justify-between border-t px-4 py-3 text-[11.5px]">
        <span className="text-text-3 tabular-nums">
          Mostrando {start}–{end} de {data.total.toLocaleString('en-US')}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Página anterior"
            disabled={!hasPrev}
            onClick={() => onPageChange(page - 1)}
            className="border-border-subtle rounded border px-2 py-1 text-[11px] disabled:opacity-40"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Página siguiente"
            disabled={!hasNext}
            onClick={() => onPageChange(page + 1)}
            className="border-border-subtle rounded border px-2 py-1 text-[11px] disabled:opacity-40"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  const alignClass = align === 'right' ? 'text-right' : 'text-left';
  return (
    <th
      className={`text-text-3 border-border-subtle border-b px-4 py-2.5 ${alignClass} text-[9.5px] font-medium tracking-[0.7px] uppercase`}
    >
      {children}
    </th>
  );
}

function Skeleton() {
  return (
    <div className="border-border-subtle bg-card flex h-64 items-center justify-center rounded-xl border">
      <div className="text-text-3 text-sm">Cargando certificados…</div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="border-border-subtle bg-card flex h-64 flex-col items-center justify-center gap-3 rounded-xl border">
      <div className="text-text-3 text-sm">No se pudieron cargar los certificados.</div>
      <button
        type="button"
        onClick={onRetry}
        className="border-border-subtle rounded border px-3 py-1 text-[12px]"
      >
        Reintentar
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border-border-subtle bg-card flex h-64 items-center justify-center rounded-xl border">
      <div className="text-text-3 text-center text-sm">
        Ningún certificado coincide con los filtros.
      </div>
    </div>
  );
}
