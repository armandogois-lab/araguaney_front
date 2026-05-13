'use client';

import Link from 'next/link';
import type { UseQueryResult } from '@tanstack/react-query';
import { fmtDate } from '@/lib/format/date';
import type { BatchListResponse } from '@/lib/types/batch';

interface Props {
  batchesQ: UseQueryResult<BatchListResponse>;
}

const VISIBLE_LIMIT = 5;

export function CycleBatchesPanel({ batchesQ }: Props) {
  return (
    <div className="bg-card border-border-subtle overflow-hidden rounded-xl border">
      <div className="border-border-subtle flex items-center justify-between border-b px-5 py-3">
        <h3 className="text-[13px] font-semibold tracking-[-0.2px]">Lotes activos en stock</h3>
        <Link href="/batches" className="text-text-3 text-[11px] hover:underline">
          Ver todos →
        </Link>
      </div>
      <Body batchesQ={batchesQ} />
    </div>
  );
}

function Body({ batchesQ }: Props) {
  if (batchesQ.isLoading) return <Centered>Cargando lotes…</Centered>;
  if (batchesQ.isError || !batchesQ.data) return <Centered>No se pudo cargar.</Centered>;
  if (batchesQ.data.data.length === 0)
    return <Centered italic>Sin lotes activos en stock.</Centered>;
  const rows = batchesQ.data.data.slice(0, VISIBLE_LIMIT);
  return (
    <div className="px-5">
      {rows.map((b, i) => (
        <div
          key={b.id}
          className={
            'flex items-center justify-between gap-3 py-3.5 ' +
            (i < rows.length - 1 ? 'border-border-soft border-b' : '')
          }
        >
          <div className="leading-snug">
            <div className="text-[12.5px] font-medium">{b.external_code}</div>
            <div className="text-text-3 mt-0.5 text-[10.5px] tabular-nums">
              {fmtDate(b.imported_at ?? b.uploaded_at)} · {b.rows_imported.toLocaleString('en-US')}{' '}
              órdenes
              {b.uploaded_by ? ` · subido por ${b.uploaded_by.full_name}` : ''}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Centered({ children, italic = false }: { children: React.ReactNode; italic?: boolean }) {
  return (
    <div
      className={
        'text-text-3 flex h-32 items-center justify-center px-5 text-sm ' + (italic ? 'italic' : '')
      }
    >
      {children}
    </div>
  );
}
