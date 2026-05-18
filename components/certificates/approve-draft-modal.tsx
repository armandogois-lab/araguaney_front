'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { approveDraft } from '@/lib/api/certificates';
import { fmtMoney2 } from '@/lib/format/money';

interface Props {
  certId: string;
  orderCount: number;
  nominalActual: string;
  onClose: () => void;
}

export function ApproveDraftModal({ certId, orderCount, nominalActual, onClose }: Props) {
  const qc = useQueryClient();
  const mut = useMutation({
    mutationFn: () => approveDraft(certId),
    onSuccess: (cert) => {
      qc.invalidateQueries({ queryKey: ['certificates'] });
      qc.invalidateQueries({ queryKey: ['certificate', certId] });
      qc.invalidateQueries({ queryKey: ['certificates-drafts-count'] });
      toast.success(`Certificado ${cert.certificate_code ?? ''} emitido`);
      onClose();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'No se pudo aprobar');
    },
  });

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
          <h2 className="text-[15px] font-semibold tracking-[-0.2px]">Aprobar este borrador</h2>
          <button
            type="button"
            onClick={onClose}
            className="bg-subtle text-text-2 flex h-7 w-7 items-center justify-center rounded-md text-[14px]"
          >
            ×
          </button>
        </header>
        <div className="text-text-2 flex flex-col gap-2 px-6 py-5 text-[13px]">
          <p>
            Se emitirán <strong>{orderCount.toLocaleString('en-US')}</strong> órdenes por{' '}
            <strong>{fmtMoney2(Number(nominalActual))}</strong>.
          </p>
          <p className="text-text-3 text-[12px]">
            Acción irreversible. El certificado obtendrá su código definitivo.
          </p>
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
            disabled={mut.isPending}
            onClick={() => mut.mutate()}
            className="bg-foreground text-background rounded-md px-3 py-1.5 text-[12px] font-medium disabled:opacity-50"
          >
            {mut.isPending ? 'Aprobando…' : 'Confirmar'}
          </button>
        </footer>
      </div>
    </div>
  );
}
