'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cancelCertificate } from '@/lib/api/certificates';

const MIN = 5;
const MAX = 1000;

interface Props {
  certId: string;
  certCode: string;
  orderCount: number;
  onClose: () => void;
}

export function CancelCertModal({ certId, certCode, orderCount, onClose }: Props) {
  const [reason, setReason] = useState('');
  const qc = useQueryClient();

  const mut = useMutation({
    mutationFn: (r: string) => cancelCertificate(certId, { reason: r }),
    onSuccess: (cert) => {
      qc.invalidateQueries({ queryKey: ['certificate', certId] });
      qc.invalidateQueries({ queryKey: ['certificates'] });
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['orders-stats'] });
      toast.success(`Certificado ${cert.certificate_code} cancelado`);
      onClose();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Error al cancelar');
    },
  });

  const trimmed = reason.trim();
  const canSubmit = trimmed.length >= MIN && trimmed.length <= MAX && !mut.isPending;

  return (
    <div
      data-testid="cancel-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card mt-24 w-full max-w-[520px] overflow-hidden rounded-xl"
      >
        <header className="border-border-subtle flex items-start justify-between border-b px-6 py-4">
          <h2 className="text-[16px] font-semibold tracking-[-0.2px]">
            Cancelar certificado {certCode}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="bg-subtle text-text-2 flex h-7 w-7 items-center justify-center rounded-md text-[14px]"
          >
            ×
          </button>
        </header>
        <div className="flex flex-col gap-3 px-6 py-5">
          <div className="bg-warn-bg text-warn-text rounded-md px-3 py-2 text-[12px]">
            ⚠️ Esta acción NO puede deshacerse. Las {orderCount} órdenes vuelven a estado
            &apos;disponible&apos;.
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-text-3 text-[11px]">Motivo de la cancelación (requerido)</span>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={MAX}
              rows={4}
              className="border-border-subtle bg-card resize-none rounded-md border px-3 py-2 text-[12px]"
            />
          </label>
          <div className="text-text-3 text-[10px] tabular-nums">
            {trimmed.length} / {MAX} caracteres · mínimo {MIN}
          </div>
        </div>
        <div className="border-border-subtle bg-card flex items-center justify-end gap-2 border-t px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={mut.isPending}
            className="border-border-subtle bg-card text-text-2 hover:bg-subtle rounded-md border px-3 py-1.5 text-[12px] font-medium disabled:opacity-40"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => mut.mutate(trimmed)}
            disabled={!canSubmit}
            className="bg-foreground text-background rounded-md px-3 py-1.5 text-[12px] font-medium disabled:opacity-40"
          >
            {mut.isPending ? 'Cancelando…' : 'Confirmar cancelación'}
          </button>
        </div>
      </div>
    </div>
  );
}
