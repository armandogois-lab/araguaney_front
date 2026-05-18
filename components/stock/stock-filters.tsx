'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listMerchants } from '@/lib/api/merchants';
import type { OrderStatus } from '@/lib/types/order';

export type StockStatusFilter = OrderStatus | 'all';

export interface StockFiltersValue {
  status: StockStatusFilter;
  merchantId: string | null;
  maxDueDateLte: string | null;
  q: string;
}

interface Props {
  value: StockFiltersValue;
  onChange: (next: StockFiltersValue) => void;
}

const STATUS_OPTIONS: Array<{ value: StockStatusFilter; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'available', label: 'Disponibles' },
  { value: 'reserved', label: 'Reservadas' },
  { value: 'assigned', label: 'Asignadas' },
  { value: 'matured', label: 'Vencidas' },
];

export function StockFilters({ value, onChange }: Props) {
  const [qLocal, setQLocal] = useState(value.q);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (qLocal === value.q) return;
    debounceRef.current = setTimeout(() => {
      onChange({ ...value, q: qLocal });
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [qLocal, value, onChange]);

  const merchants = useQuery({
    queryKey: ['merchants'],
    queryFn: () => listMerchants({ limit: 200, sort: 'name_asc' }),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="border-border-subtle flex items-center gap-1 rounded-md border p-1">
          {STATUS_OPTIONS.map((opt) => {
            const active = value.status === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                data-active={active}
                onClick={() => onChange({ ...value, status: opt.value })}
                className={
                  'rounded px-3 py-1 text-[12px] font-medium transition-colors ' +
                  (active ? 'bg-foreground text-background' : 'text-text-2 hover:bg-subtle')
                }
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <input
          type="search"
          placeholder="🔎 Código de orden"
          value={qLocal}
          onChange={(e) => setQLocal(e.target.value)}
          className="border-border-subtle bg-card w-64 rounded-md border px-3 py-1.5 text-[12px]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-[11px]">
          <span className="text-text-3">Comercio</span>
          <select
            aria-label="Comercio"
            value={value.merchantId ?? ''}
            onChange={(e) =>
              onChange({ ...value, merchantId: e.target.value === '' ? null : e.target.value })
            }
            className="border-border-subtle bg-card rounded-md border px-2 py-1 text-[12px]"
            disabled={merchants.isLoading}
          >
            <option value="">Todos</option>
            {merchants.data?.data.map((m) => (
              <option key={m.id} value={m.id}>
                {m.current_name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-[11px]">
          <span className="text-text-3">Vence antes de</span>
          <input
            type="date"
            aria-label="Vence antes de"
            value={value.maxDueDateLte ?? ''}
            onChange={(e) =>
              onChange({
                ...value,
                maxDueDateLte: e.target.value === '' ? null : e.target.value,
              })
            }
            className="border-border-subtle bg-card rounded-md border px-2 py-1 text-[12px]"
          />
        </label>
      </div>
    </div>
  );
}
