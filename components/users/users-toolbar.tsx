'use client';

import { useEffect, useRef, useState } from 'react';
import type { UserRole } from '@/lib/types/user';

export interface UsersFiltersValue {
  q: string;
  role: UserRole | 'all';
  is_active: 'all' | 'active' | 'inactive';
}

interface Props {
  value: UsersFiltersValue;
  onChange: (next: UsersFiltersValue) => void;
}

export function UsersToolbar({ value, onChange }: Props) {
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
        placeholder="🔎 Email o nombre"
        value={qLocal}
        onChange={(e) => setQLocal(e.target.value)}
        className="border-border-subtle bg-card flex-1 rounded-md border px-3 py-1.5 text-[12px]"
      />
      <label className="flex items-center gap-2 text-[11px]">
        <span className="text-text-3">Rol</span>
        <select
          aria-label="Rol"
          value={value.role}
          onChange={(e) =>
            onChange({ ...value, role: e.target.value as UsersFiltersValue['role'] })
          }
          className="border-border-subtle bg-card rounded-md border px-2 py-1 text-[12px]"
        >
          <option value="all">Todos</option>
          <option value="operator">Operador</option>
          <option value="admin">Admin</option>
          <option value="auditor">Auditor</option>
        </select>
      </label>
      <label className="flex items-center gap-2 text-[11px]">
        <span className="text-text-3">Estado</span>
        <select
          aria-label="Estado"
          value={value.is_active}
          onChange={(e) =>
            onChange({
              ...value,
              is_active: e.target.value as UsersFiltersValue['is_active'],
            })
          }
          className="border-border-subtle bg-card rounded-md border px-2 py-1 text-[12px]"
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
      </label>
    </div>
  );
}
