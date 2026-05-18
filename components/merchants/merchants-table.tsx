'use client';

import { fmtDate } from '@/lib/format/date';
import { fmtMoney2 } from '@/lib/format/money';
import type { MerchantSummary } from '@/lib/types/merchant';

interface Props {
  rows: MerchantSummary[];
  isLoading: boolean;
  isError: boolean;
  onRowClick: (id: string) => void;
  onRetry: () => void;
}

export function MerchantsTable({ rows, isLoading, isError, onRowClick, onRetry }: Props) {
  if (isLoading) {
    return (
      <div className="bg-card border-border-subtle flex h-64 items-center justify-center rounded-xl border">
        <div className="text-text-3 text-sm">Cargando comercios…</div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="bg-card border-border-subtle flex h-64 flex-col items-center justify-center gap-3 rounded-xl border">
        <div className="text-text-3 text-sm">No se pudieron cargar los comercios.</div>
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
  if (rows.length === 0) {
    return (
      <div className="bg-card border-border-subtle flex h-64 items-center justify-center rounded-xl border">
        <div className="text-text-3 text-center text-sm italic">
          Sin comercios que coincidan.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-border-subtle overflow-hidden rounded-xl border">
      <table className="w-full text-[12.5px]">
        <thead className="bg-subtle">
          <tr>
            <Th>Comercio</Th>
            <Th>RIF</Th>
            <Th align="right">Órdenes</Th>
            <Th align="right">Monto total</Th>
            <Th>Último visto</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((m) => (
            <tr
              key={m.id}
              onClick={() => onRowClick(m.id)}
              className="hover:bg-subtle cursor-pointer border-t border-border-subtle"
            >
              <Td>{m.current_name}</Td>
              <Td>
                <span className="font-mono text-[11.5px]">{m.rif}</span>
              </Td>
              <Td align="right">{m.order_count.toLocaleString('en-US')}</Td>
              <Td align="right">{fmtMoney2(Number(m.total_orders_amount))}</Td>
              <Td>
                <span className="tabular-nums">{fmtDate(m.last_seen_at)}</span>
              </Td>
            </tr>
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

function Td({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  const alignClass = align === 'right' ? 'text-right' : 'text-left';
  return <td className={`px-4 py-2.5 ${alignClass}`}>{children}</td>;
}
