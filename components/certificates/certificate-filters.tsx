'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listInvestors } from '@/lib/api/investors';
import type { CertificateStatus } from '@/lib/types/certificate';

export type CertificateStatusFilter = CertificateStatus | 'all';

export interface CertificateFiltersValue {
  status: CertificateStatusFilter;
  investorId: string | null;
  issueDateFrom: string | null;
  issueDateTo: string | null;
  q: string;
}

interface Props {
  value: CertificateFiltersValue;
  onChange: (next: CertificateFiltersValue) => void;
}

const STATUS_OPTIONS: Array<{ value: CertificateStatusFilter; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'issued', label: 'Activos' },
  { value: 'draft', label: 'Borradores' },
  { value: 'matured', label: 'Vencidos' },
  { value: 'cancelled', label: 'Cancelados' },
];

export function CertificateFilters({ value, onChange }: Props) {
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

  const investors = useQuery({
    queryKey: ['investors'],
    queryFn: () =>
      listInvestors({ limit: 200, kind: 'juridica', status: 'active', sort: 'name_asc' }),
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
          placeholder="🔎 Código (ej. C4572A)"
          value={qLocal}
          onChange={(e) => setQLocal(e.target.value)}
          className="border-border-subtle bg-card w-64 rounded-md border px-3 py-1.5 text-[12px]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-[11px]">
          <span className="text-text-3">Inversor</span>
          <select
            aria-label="Inversor"
            value={value.investorId ?? ''}
            onChange={(e) =>
              onChange({
                ...value,
                investorId: e.target.value === '' ? null : e.target.value,
              })
            }
            className="border-border-subtle bg-card rounded-md border px-2 py-1 text-[12px]"
            disabled={investors.isLoading}
          >
            <option value="">Todos</option>
            {investors.data?.data.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.legal_name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-[11px]">
          <span className="text-text-3">Emitido desde</span>
          <input
            type="date"
            aria-label="Emitido desde"
            value={value.issueDateFrom ?? ''}
            onChange={(e) =>
              onChange({
                ...value,
                issueDateFrom: e.target.value === '' ? null : e.target.value,
              })
            }
            className="border-border-subtle bg-card rounded-md border px-2 py-1 text-[12px]"
          />
        </label>
        <label className="flex items-center gap-2 text-[11px]">
          <span className="text-text-3">hasta</span>
          <input
            type="date"
            aria-label="hasta"
            value={value.issueDateTo ?? ''}
            onChange={(e) =>
              onChange({
                ...value,
                issueDateTo: e.target.value === '' ? null : e.target.value,
              })
            }
            className="border-border-subtle bg-card rounded-md border px-2 py-1 text-[12px]"
          />
        </label>
      </div>
    </div>
  );
}
