'use client';

import { useEffect, useRef, useState } from 'react';

export interface TraceFiltersValue {
  q: string;
  dateFrom: string;
  dateTo: string;
}

interface Props {
  value: TraceFiltersValue;
  onChange: (next: TraceFiltersValue) => void;
}

export function TraceToolbar({ value, onChange }: Props) {
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
        placeholder="🔎 Código, inversor, RIF o usuario emisor"
        value={qLocal}
        onChange={(e) => setQLocal(e.target.value)}
        className="border-border-subtle bg-card flex-1 rounded-md border px-3 py-1.5 text-[12px]"
      />
      <label className="flex items-center gap-2 text-[11px]">
        <span className="text-text-3">Desde</span>
        <input
          type="date"
          aria-label="Desde"
          value={value.dateFrom}
          onChange={(e) => onChange({ ...value, dateFrom: e.target.value })}
          className="border-border-subtle bg-card rounded-md border px-2 py-1 text-[12px]"
        />
      </label>
      <label className="flex items-center gap-2 text-[11px]">
        <span className="text-text-3">Hasta</span>
        <input
          type="date"
          aria-label="Hasta"
          value={value.dateTo}
          onChange={(e) => onChange({ ...value, dateTo: e.target.value })}
          className="border-border-subtle bg-card rounded-md border px-2 py-1 text-[12px]"
        />
      </label>
    </div>
  );
}
