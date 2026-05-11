'use client';

import { toast } from 'sonner';
import { InvestorCreateForm } from '@/components/cert-wizard/investor-create-form';

interface Props {
  onClose: () => void;
}

export function InvestorCreateModal({ onClose }: Props) {
  return (
    <div
      data-testid="create-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card mt-16 w-full max-w-[520px] overflow-hidden rounded-xl"
      >
        <header className="border-border-subtle flex items-start justify-between border-b px-6 py-4">
          <h2 className="text-[16px] font-semibold tracking-[-0.2px]">Registrar inversor</h2>
          <button
            type="button"
            onClick={onClose}
            className="bg-subtle text-text-2 flex h-7 w-7 items-center justify-center rounded-md text-[14px]"
          >
            ×
          </button>
        </header>
        <div className="px-6 py-5">
          <InvestorCreateForm
            onCreated={(inv) => {
              toast.success(`Inversor ${inv.legal_name} registrado`);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
