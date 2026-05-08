'use client';

import { useQuery } from '@tanstack/react-query';
import { listBatches } from '@/lib/api/batches';
import { fmtDate } from '@/lib/format/date';

export function UploadBatchRecent() {
  const { data } = useQuery({
    queryKey: ['batches', { limit: 3, offset: 0 }],
    queryFn: () => listBatches({ limit: 3, offset: 0 }),
  });

  if (!data || data.data.length === 0) return null;

  return (
    <div className="mt-5">
      <div className="text-text-3 mb-2.5 text-[10px] font-medium tracking-[0.7px] uppercase">
        Lotes recientes
      </div>
      <div>
        {data.data.map((b, i) => (
          <div
            key={b.id}
            className={
              'flex items-center justify-between py-2.5' +
              (i < data.data.length - 1 ? ' border-border-soft border-b' : '')
            }
          >
            <div className="text-[12px]">
              <span className="font-medium">Lote {b.external_code}</span>
              <span className="text-text-3 ml-2.5 text-[11px]">
                {fmtDate(b.uploaded_at)} · {b.uploaded_by?.full_name ?? '—'}
              </span>
            </div>
            <div className="text-text-3 num text-[11px]">
              {b.rows_imported.toLocaleString('en-US')} órdenes
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
