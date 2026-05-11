'use client';

import { useQuery } from '@tanstack/react-query';
import { listInvestors, type ListInvestorsQuery } from '@/lib/api/investors';
import type { InvestorSummary } from '@/lib/types/investor';
import { InvestorRow } from './investor-row';
import type { InvestorsFiltersValue } from './investors-filters';

const PAGE_LIMIT = 50;

interface Props {
  filters: InvestorsFiltersValue;
  page: number;
  onPageChange: (next: number) => void;
  onEditInvestor?: (investor: InvestorSummary) => void;
}

export function buildQuery(filters: InvestorsFiltersValue, page: number): ListInvestorsQuery {
  return {
    limit: PAGE_LIMIT,
    offset: page * PAGE_LIMIT,
    status: filters.status === 'all' ? undefined : filters.status,
    q: filters.q || undefined,
    sort: 'name_asc',
  };
}

export function InvestorsTable({ filters, page, onPageChange, onEditInvestor }: Props) {
  const query = buildQuery(filters, page);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['investors', query],
    queryFn: () => listInvestors(query),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <Skeleton />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  // Client-side filter: back does not support kind!=internal today.
  const visible = (data?.data ?? []).filter((i) => i.kind !== 'internal');

  if (!data || visible.length === 0) return <EmptyState />;

  const start = data.offset + 1;
  const end = Math.min(data.offset + data.limit, data.total);
  const hasPrev = page > 0;
  const hasNext = data.offset + data.limit < data.total;

  return (
    <div className="bg-card border-border-subtle overflow-hidden rounded-xl border">
      <table className="w-full text-[12.5px]">
        <thead className="bg-subtle">
          <tr>
            <Th>Razón social</Th>
            <Th>RIF</Th>
            <Th align="right">Certificados</Th>
            <Th align="right">Capital activo</Th>
            <Th>Estado</Th>
          </tr>
        </thead>
        <tbody>
          {visible.map((i) => (
            <InvestorRow key={i.id} investor={i} onEdit={onEditInvestor} />
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
      <div className="text-text-3 text-sm">Cargando inversores…</div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="border-border-subtle bg-card flex h-64 flex-col items-center justify-center gap-3 rounded-xl border">
      <div className="text-text-3 text-sm">No se pudieron cargar los inversores.</div>
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
        Ningún inversor coincide con los filtros.
      </div>
    </div>
  );
}
