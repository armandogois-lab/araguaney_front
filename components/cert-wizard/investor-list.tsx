'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listInvestors } from '@/lib/api/investors';
import type { InvestorSummary } from '@/lib/types/investor';

interface Props {
  onSelect: (investor: InvestorSummary) => void;
}

export function InvestorList({ onSelect }: Props) {
  const [q, setQ] = useState('');
  const { data, isLoading, isError } = useQuery({
    queryKey: ['investors', { q, kind: 'juridica', status: 'active' }],
    queryFn: () =>
      listInvestors({ q: q || undefined, kind: 'juridica', status: 'active', limit: 50 }),
    staleTime: 60 * 1000,
  });

  return (
    <div className="flex flex-col gap-3">
      <input
        type="search"
        placeholder="🔎 Buscar por razón social o RIF"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="border-border-subtle bg-card rounded-md border px-3 py-2 text-[12px]"
      />
      {isLoading && <div className="text-text-3 py-12 text-center text-sm">Cargando…</div>}
      {isError && (
        <div className="text-text-3 py-12 text-center text-sm">
          No se pudieron cargar los inversores.
        </div>
      )}
      {data && data.data.length === 0 && (
        <div className="text-text-3 py-12 text-center text-sm">
          No hay inversores que coincidan.
        </div>
      )}
      {data && data.data.length > 0 && (
        <ul className="border-border-subtle divide-border-subtle bg-card divide-y rounded-md border">
          {data.data.map((inv) => (
            <li key={inv.id}>
              <button
                type="button"
                onClick={() => onSelect(inv)}
                className="hover:bg-subtle flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors"
              >
                <div>
                  <div className="text-[13px] font-medium">{inv.legal_name}</div>
                  <div className="text-text-3 mt-0.5 font-mono text-[11px]">{inv.rif}</div>
                </div>
                <div className="text-text-3 text-[11px]">{inv.kind}</div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
