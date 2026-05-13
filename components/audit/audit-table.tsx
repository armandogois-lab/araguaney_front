'use client';

import { useQuery } from '@tanstack/react-query';
import { listAudit, type ListAuditQuery } from '@/lib/api/audit';
import type { AuditEntry } from '@/lib/types/audit';
import { AuditRow } from './audit-row';
import type { AuditFiltersValue } from './audit-filters';

const PAGE_LIMIT = 50;

interface Props {
  filters: AuditFiltersValue;
  page: number;
  onPageChange: (next: number) => void;
  onSelectEntry: (entry: AuditEntry) => void;
}

function buildQuery(filters: AuditFiltersValue, page: number): ListAuditQuery {
  return {
    limit: PAGE_LIMIT,
    offset: page * PAGE_LIMIT,
    entity_type: filters.entityType === 'all' ? undefined : filters.entityType,
    action: filters.action === 'all' ? undefined : filters.action,
    occurred_at_from: filters.dateFrom || undefined,
    occurred_at_to: filters.dateTo || undefined,
  };
}

export function AuditTable({ filters, page, onPageChange, onSelectEntry }: Props) {
  const query = buildQuery(filters, page);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['audit', query],
    queryFn: () => listAudit(query),
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
            <Th>Fecha</Th>
            <Th>Actor</Th>
            <Th>Acción</Th>
            <Th>Entidad</Th>
            <Th>ID</Th>
            <Th>IP</Th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((e) => (
            <AuditRow key={e.id} entry={e} onSelect={onSelectEntry} />
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

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-text-3 border-border-subtle border-b px-4 py-2.5 text-left text-[9.5px] font-medium tracking-[0.7px] uppercase">
      {children}
    </th>
  );
}

function Skeleton() {
  return (
    <div className="border-border-subtle bg-card flex h-64 items-center justify-center rounded-xl border">
      <div className="text-text-3 text-sm">Cargando eventos…</div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="border-border-subtle bg-card flex h-64 flex-col items-center justify-center gap-3 rounded-xl border">
      <div className="text-text-3 text-sm">No se pudieron cargar los eventos.</div>
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
      <div className="text-text-3 text-center text-sm">Sin eventos en este rango.</div>
    </div>
  );
}
