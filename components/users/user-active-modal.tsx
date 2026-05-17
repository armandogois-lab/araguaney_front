'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateUser } from '@/lib/api/users';
import type { AppUser } from '@/lib/types/user';

interface Props {
  target: AppUser;
  onClose: () => void;
}

export function UserActiveModal({ target, onClose }: Props) {
  const next = !target.is_active;
  const qc = useQueryClient();

  const mut = useMutation({
    mutationFn: () => updateUser(target.id, { is_active: next }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success(next ? `${target.full_name} activado` : `${target.full_name} desactivado`);
      onClose();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'No se pudo actualizar');
    },
  });

  const title = next ? `Activar ${target.full_name}` : `Desactivar ${target.full_name}`;
  const description = next
    ? `Restaurará el acceso de ${target.full_name} al sistema.`
    : `Perderá acceso al sistema. Podés reactivarlo después.`;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card mt-16 w-full max-w-[440px] overflow-hidden rounded-xl"
      >
        <header className="border-border-subtle flex items-start justify-between border-b px-6 py-4">
          <h2 className="text-[15px] font-semibold tracking-[-0.2px]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="bg-subtle text-text-2 flex h-7 w-7 items-center justify-center rounded-md text-[14px]"
          >
            ×
          </button>
        </header>
        <div className="text-text-2 px-6 py-5 text-[13px]">{description}</div>
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
            disabled={mut.isPending}
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
