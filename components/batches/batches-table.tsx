'use client';

import { useQuery } from '@tanstack/react-query';
import { listBatches } from '@/lib/api/batches';
import { BatchRow } from './batch-row';

const PAGE_LIMIT = 50;

export function BatchesTable() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['batches', { limit: PAGE_LIMIT, offset: 0 }],
    queryFn: () => listBatches({ limit: PAGE_LIMIT, offset: 0 }),
  });

  if (isLoading) return <Skeleton />;
  if (isError) return <ErrorState />;
  if (!data || data.data.length === 0) return <EmptyState />;

  return (
    <div className="bg-card border-border-subtle overflow-hidden rounded-xl border">
      <table className="w-full text-[12.5px]">
        <thead className="bg-subtle">
          <tr>
            <Th>Código</Th>
            <Th>Subido</Th>
            <Th>Por</Th>
            <Th align="right">Órdenes</Th>
            <Th align="right">Capital</Th>
            <Th>Estado</Th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((b) => (
            <BatchRow key={b.id} batch={b} />
          ))}
        </tbody>
      </table>
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
      <div className="text-text-3 text-sm">Cargando lotes…</div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="border-border-subtle bg-card flex h-64 items-center justify-center rounded-xl border">
      <div className="text-text-3 text-sm">No se pudieron cargar los lotes. Recarga la página.</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border-border-subtle bg-card flex h-64 items-center justify-center rounded-xl border">
      <div className="text-center">
        <div className="mb-1 text-base font-semibold">Sin lotes todavía</div>
        <p className="text-text-3 text-sm">Sube un Excel para empezar.</p>
      </div>
    </div>
  );
}
