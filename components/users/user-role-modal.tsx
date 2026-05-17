'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateUser } from '@/lib/api/users';
import type { AppUser, UserRole } from '@/lib/types/user';

interface Props {
  target: AppUser;
  onClose: () => void;
}

const ROLE_LABEL: Record<UserRole, string> = {
  admin: 'Admin',
  auditor: 'Auditor',
  operator: 'Operador',
};

export function UserRoleModal({ target, onClose }: Props) {
  const [selected, setSelected] = useState<UserRole>(target.role);
  const qc = useQueryClient();

  const mut = useMutation({
    mutationFn: () => updateUser(target.id, { role: selected }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success(`Rol de ${target.full_name} actualizado`);
      onClose();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'No se pudo actualizar');
    },
  });

  const canSubmit = selected !== target.role && !mut.isPending;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card mt-16 w-full max-w-[480px] overflow-hidden rounded-xl"
      >
        <header className="border-border-subtle flex items-start justify-between border-b px-6 py-4">
          <h2 className="text-[15px] font-semibold tracking-[-0.2px]">
            Cambiar rol de {target.full_name}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="bg-subtle text-text-2 flex h-7 w-7 items-center justify-center rounded-md text-[14px]"
          >
            ×
          </button>
        </header>
        <div className="flex flex-col gap-4 px-6 py-5">
          <p className="text-text-2 text-[12px]">
            {`Rol actual: ${ROLE_LABEL[target.role]}`}
          </p>
          <label className="flex flex-col gap-1">
            <span className="text-text-3 text-[11px] uppercase tracking-wide">Nuevo rol</span>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value as UserRole)}
              className="border-border-subtle bg-card rounded-md border px-3 py-1.5 text-[13px]"
            >
              <option value="operator">Operador</option>
              <option value="admin">Admin</option>
              <option value="auditor">Auditor</option>
            </select>
          </label>
        </div>
        <footer className="border-border-subtle flex justify-end gap-2 border-t px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="text-text-2 rounded-md px-3 py-1.5 text-[12px]"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => mut.mutate()}
            className="bg-foreground text-background rounded-md px-3 py-1.5 text-[12px] font-medium disabled:opacity-50"
          >
            {mut.isPending ? 'Guardando…' : 'Confirmar'}
          </button>
        </footer>
      </div>
    </div>
  );
}
