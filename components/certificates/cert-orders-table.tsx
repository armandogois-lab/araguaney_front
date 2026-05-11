'use client';

import { useState, useMemo } from 'react';
import { fmtDate } from '@/lib/format/date';
import { fmtMoney2 } from '@/lib/format/money';
import type { CertificateOrder } from '@/lib/types/certificate';

interface Props {
  orders: CertificateOrder[];
}

export function CertOrdersTable({ orders }: Props) {
  const [q, setQ] = useState('');

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
          {filtered.map((o) => (
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
      <div className="bg-subtle border-border-subtle border-t px-4 py-3 text-[11.5px]">
        <span className="font-medium">Total del pool: </span>
        <span className="tabular-nums">
          {fmtMoney2(totalAmount)} · {filtered.length} órdenes · {totalInstallments} cuotas
        </span>
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
