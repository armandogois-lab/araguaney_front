'use client';

import { useEffect, useRef, useState } from 'react';

export type MerchantsSort = 'name_asc' | 'name_desc' | 'last_seen_desc';

export interface MerchantsFiltersValue {
  q: string;
  sort: MerchantsSort;
}

interface Props {
  value: MerchantsFiltersValue;
  onChange: (next: MerchantsFiltersValue) => void;
}

export function MerchantsToolbar({ value, onChange }: Props) {
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
    <div className="bg-card border-border-subtle flex flex-wrap items-center gap-2 rounded-xl border px-4 py-3">
      <input
        type="search"
        placeholder="🔎 Comercio o RIF"
        value={qLocal}
        onChange={(e) => setQLocal(e.target.value)}
        className="border-border-subtle bg-card flex-1 rounded-md border px-3 py-1.5 text-[12px]"
      />
      <label className="flex items-center gap-2 text-[11px]">
        <span className="text-text-3">Orden</span>
        <select
          aria-label="Orden"
          value={value.sort}
          onChange={(e) => onChange({ ...value, sort: e.target.value as MerchantsSort })}
          className="border-border-subtle bg-card rounded-md border px-2 py-1 text-[12px]"
        >
          <option value="name_asc">Nombre A→Z</option>
          <option value="name_desc">Nombre Z→A</option>
          <option value="last_seen_desc">Último visto</option>
        </select>
      </label>
    </div>
  );
}
