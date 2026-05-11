'use client';

import { useEffect, useRef, useState } from 'react';
import type { InvestorStatus } from '@/lib/types/investor';

export type InvestorsStatusFilter = InvestorStatus | 'all';

export interface InvestorsFiltersValue {
  status: InvestorsStatusFilter;
  q: string;
}

interface Props {
  value: InvestorsFiltersValue;
  onChange: (next: InvestorsFiltersValue) => void;
}

const STATUS_OPTIONS: Array<{ value: InvestorsStatusFilter; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
];

export function InvestorsFilters({ value, onChange }: Props) {
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

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <input
        type="search"
        placeholder="🔎 Razón social o RIF"
        value={qLocal}
        onChange={(e) => setQLocal(e.target.value)}
        className="border-border-subtle bg-card w-80 rounded-md border px-3 py-1.5 text-[12px]"
      />
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
    </div>
  );
}
