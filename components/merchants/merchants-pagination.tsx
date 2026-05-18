'use client';

interface Props {
  offset: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function MerchantsPagination({ offset, limit, total, onPageChange }: Props) {
  const page = Math.floor(offset / limit);
  const start = total === 0 ? 0 : offset + 1;
  const end = Math.min(offset + limit, total);
  const hasPrev = offset > 0;
  const hasNext = offset + limit < total;

  return (
    <div className="bg-card border-border-subtle flex items-center justify-between rounded-xl border px-4 py-3 text-[11.5px]">
      <span className="text-text-3 tabular-nums">
        {start}–{end} de {total.toLocaleString('en-US')}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Anterior"
          disabled={!hasPrev}
          onClick={() => onPageChange(page - 1)}
          className="border-border-subtle rounded border px-3 py-1 text-[11px] disabled:opacity-40"
        >
          ← Anterior
        </button>
        <button
          type="button"
          aria-label="Siguiente"
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
          className="border-border-subtle rounded border px-3 py-1 text-[11px] disabled:opacity-40"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
