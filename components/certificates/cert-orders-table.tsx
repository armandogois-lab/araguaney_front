'use client';

import { useMemo, useState } from 'react';
import { fmtDate } from '@/lib/format/date';
import { fmtMoney2 } from '@/lib/format/money';
import type { CertificateOrder } from '@/lib/types/certificate';

interface Props {
  orders: CertificateOrder[];
}

const PAGE_SIZE = 50;

export function CertOrdersTable({ orders }: Props) {
  const [q, setQ] = useState('');
  // Store filter key alongside page so resets happen during render (no useEffect)
  const [{ page, filterKey }, setPageState] = useState({ page: 0, filterKey: '' });

  const currentFilterKey = `${q}|${orders.length}`;
  const effectivePage = currentFilterKey !== filterKey ? 0 : page;

  const filtered = useMemo(() => {
    if (!q.trim()) return orders;
    const needle = q.toLowerCase().trim();
    return orders.filter(
      (o) =>
        o.external_order_id.toLowerCase().includes(needle) ||
        o.merchant.current_name.toLowerCase().includes(needle),
    );
  }, [orders, q]);

  if (orders.length === 0) {
    return (
      <div className="border-border-subtle bg-card flex h-48 items-center justify-center rounded-xl border">
        <div className="text-text-3 text-sm">Sin órdenes en este pool.</div>
      </div>
    );
  }

  const totalAmount = filtered.reduce((acc, o) => acc + Number(o.installments_sum_snapshot), 0);
  const totalInstallments = filtered.reduce((acc, o) => acc + o.installments.length, 0);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(effectivePage, totalPages - 1);
  const filterKeyForState = currentFilterKey;
  const start = filtered.length === 0 ? 0 : safePage * PAGE_SIZE + 1;
  const end = Math.min((safePage + 1) * PAGE_SIZE, filtered.length);
  const paginated = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);
  const hasPrev = safePage > 0;
  const hasNext = safePage < totalPages - 1;

  return (
    <div className="bg-card border-border-subtle overflow-hidden rounded-xl border">
      <div className="border-border-subtle flex items-center gap-3 border-b px-4 py-3">
        <input
          type="search"
          placeholder="🔎 ID o comercio"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border-border-subtle bg-card flex-1 rounded-md border px-3 py-1.5 text-[12px]"
        />
        <span className="text-text-3 text-[11px]">
          {filtered.length} de {orders.length}
        </span>
      </div>
      <table className="w-full text-[12px]">
        <thead className="bg-subtle">
          <tr>
            <Th>ID</Th>
            <Th>Comercio</Th>
            <Th align="right">Cuotas</Th>
            <Th>Compra</Th>
            <Th>Últ. vence</Th>
            <Th align="right">Monto</Th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((o) => (
            <tr key={o.id} className="border-border-soft hover:bg-subtle border-b">
              <td className="text-text-2 px-4 py-3 font-mono text-[11.5px]">
                {o.external_order_id}
              </td>
              <td className="max-w-[260px] truncate px-4 py-3" title={o.merchant.current_name}>
                {o.merchant.current_name}
              </td>
              <td className="num px-4 py-3 text-right">{o.installments.length}</td>
              <td className="num px-4 py-3">{fmtDate(o.purchase_date)}</td>
              <td className="num px-4 py-3">{fmtDate(o.max_due_date)}</td>
              <td className="num px-4 py-3 text-right font-medium">
                {fmtMoney2(Number(o.installments_sum_snapshot))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-border-subtle flex items-center justify-between border-t px-4 py-3 text-[11.5px]">
        <span className="text-text-3 tabular-nums">
          Mostrando {start}–{end} de {filtered.length.toLocaleString('en-US')}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Página anterior"
            disabled={!hasPrev}
            onClick={() =>
              setPageState({ page: Math.max(0, safePage - 1), filterKey: filterKeyForState })
            }
            className="border-border-subtle rounded border px-2 py-1 text-[11px] disabled:opacity-40"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Página siguiente"
            disabled={!hasNext}
            onClick={() => setPageState({ page: safePage + 1, filterKey: filterKeyForState })}
            className="border-border-subtle rounded border px-2 py-1 text-[11px] disabled:opacity-40"
          >
            →
          </button>
        </div>
      </div>
      <div className="bg-subtle border-border-subtle border-t px-4 py-3 text-[11.5px] tabular-nums">
        {`Total del pool: ${fmtMoney2(totalAmount)} · ${filtered.length} órdenes · ${totalInstallments} cuotas`}
      </div>
    </div>
  );
}

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  const alignClass = align === 'right' ? 'text-right' : 'text-left';
  return (
    <th
      className={`text-text-3 border-border-subtle border-b px-4 py-2 ${alignClass} text-[9.5px] font-medium tracking-[0.7px] uppercase`}
    >
      {children}
    </th>
  );
}
