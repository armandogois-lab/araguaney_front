import { fmtDate } from '@/lib/format/date';
import { fmtMoney } from '@/lib/format/money';
import type { BatchSummary } from '@/lib/types/batch';
import { BatchStatusPill } from './batch-status-pill';

export function BatchRow({ batch }: { batch: BatchSummary }) {
  return (
    <tr className="border-border-soft hover:bg-subtle border-b transition-colors">
      <td className="text-text-2 px-4 py-3.5 font-mono text-[11.5px]">{batch.external_code}</td>
      <td className="num px-4 py-3.5">{fmtDate(batch.uploaded_at)}</td>
      <td className="px-4 py-3.5">{batch.uploaded_by?.full_name ?? '—'}</td>
      <td className="num px-4 py-3.5 text-right font-medium">
        {batch.rows_imported.toLocaleString('en-US')}
      </td>
      <td className="num px-4 py-3.5 text-right font-medium">
        {fmtMoney(Number(batch.total_orders_amount))}
      </td>
      <td className="px-4 py-3.5">
        <BatchStatusPill status={batch.status} />
      </td>
    </tr>
  );
}
