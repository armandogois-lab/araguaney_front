'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cancelCertificate } from '@/lib/api/certificates';
import type { CertificateStatus } from '@/lib/types/certificate';

const MAX = 1000;
const MIN = 5;

interface CertProp {
  id: string;
  certificate_code: string | null;
  status: CertificateStatus;
  order_count: number;
}

interface Props {
  cert: CertProp;
  onClose: () => void;
}

export function CancelCertModal({ cert, onClose }: Props) {
  const [reason, setReason] = useState('');
  const qc = useQueryClient();

  const isDraft = cert.status === 'draft';
  const title = isDraft ? 'Cancelar borrador' : `Cancelar certificado ${cert.certificate_code}`;
  const description = isDraft
    ? `Las ${cert.order_count} órdenes reservadas vuelven al stock.`
    : `Esta acción NO puede deshacerse. Las ${cert.order_count} órdenes vuelven a estado 'disponible'.`;
  const reasonLabel = isDraft ? 'Razón (opcional)' : 'Motivo de la cancelación (requerido)';

  const mut = useMutation({
    mutationFn: (body: { reason?: string }) => cancelCertificate(cert.id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['certificate', cert.id] });
      qc.invalidateQueries({ queryKey: ['certificates'] });
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['orders-stats'] });
      toast.success(
        isDraft
          ? 'Borrador cancelado'
          : `Certificado ${cert.certificate_code} cancelado`,
      );
      onClose();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Error al cancelar');
    },
  });

  const trimmed = reason.trim();

  function handleSubmit() {
    const body = trimmed ? { reason: trimmed } : {};
    mut.mutate(body);
  }

  const canSubmit = isDraft
    ? !mut.isPending
    : trimmed.length >= MIN && trimmed.length <= MAX && !mut.isPending;

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
          <h2 className="text-[16px] font-semibold tracking-[-0.2px]">{title}</h2>
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
            ⚠️ {description}
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-text-3 text-[11px]">{reasonLabel}</span>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={MAX}
              rows={4}
              className="border-border-subtle bg-card resize-none rounded-md border px-3 py-2 text-[12px]"
            />
          </label>
          <div className="text-text-3 text-[10px] tabular-nums">
            {trimmed.length} / {MAX} caracteres{!isDraft && ` · mínimo ${MIN}`}
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
            onClick={handleSubmit}
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
