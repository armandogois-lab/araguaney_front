'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateInvestor } from '@/lib/api/investors';
import type { InvestorStatus, InvestorSummary, InvestorUpdate } from '@/lib/types/investor';

interface Props {
  investor: InvestorSummary;
  onClose: () => void;
}

export function InvestorEditModal({ investor, onClose }: Props) {
  const [legalName, setLegalName] = useState(investor.legal_name);
  const [email, setEmail] = useState(investor.email ?? '');
  const [phone, setPhone] = useState(investor.phone ?? '');
  const [notes, setNotes] = useState(investor.notes ?? '');
  const [status, setStatus] = useState<InvestorStatus>(investor.status);
  const qc = useQueryClient();

  const mut = useMutation({
    mutationFn: (body: InvestorUpdate) => updateInvestor(investor.id, body),
    onSuccess: (inv) => {
      qc.invalidateQueries({ queryKey: ['investors'] });
      toast.success(`Inversor ${inv.legal_name} actualizado`);
      onClose();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'No se pudo actualizar');
    },
  });

  function buildDirtyPayload(): InvestorUpdate {
    const body: InvestorUpdate = {};
    const trimmedLegal = legalName.trim();
    if (trimmedLegal !== investor.legal_name) body.legal_name = trimmedLegal;
    const trimmedEmail = email.trim();
    const nextEmail = trimmedEmail === '' ? null : trimmedEmail;
    if (nextEmail !== investor.email) body.email = nextEmail;
    const trimmedPhone = phone.trim();
    const nextPhone = trimmedPhone === '' ? null : trimmedPhone;
    if (nextPhone !== investor.phone) body.phone = nextPhone;
    const trimmedNotes = notes.trim();
    const nextNotes = trimmedNotes === '' ? null : trimmedNotes;
    if (nextNotes !== investor.notes) body.notes = nextNotes;
    if (status !== investor.status) body.status = status;
    return body;
  }

  const payload = buildDirtyPayload();
  const dirty = Object.keys(payload).length > 0;
  const legalNameValid = legalName.trim().length >= 1 && legalName.trim().length <= 255;
  const emailValid = email.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const phoneValid = phone.trim() === '' || phone.trim().length <= 50;
  const notesValid = notes.length <= 1000;
  const canSubmit =
    dirty && legalNameValid && emailValid && phoneValid && notesValid && !mut.isPending;

  return (
    <div
      data-testid="edit-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card mt-16 w-full max-w-[520px] overflow-hidden rounded-xl"
      >
        <header className="border-border-subtle flex items-start justify-between border-b px-6 py-4">
          <h2 className="text-[16px] font-semibold tracking-[-0.2px]">
            Editar {investor.legal_name}
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
          <Field label="Razón social *" id="legal_name">
            <input
              id="legal_name"
              type="text"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              maxLength={255}
              className="border-border-subtle bg-card rounded-md border px-3 py-2 text-[12px]"
            />
          </Field>
          <Field label="Email" id="email">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              className="border-border-subtle bg-card rounded-md border px-3 py-2 text-[12px]"
            />
          </Field>
          <Field label="Teléfono" id="phone">
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={50}
              className="border-border-subtle bg-card rounded-md border px-3 py-2 text-[12px]"
            />
          </Field>
          <Field label="Notas" id="notes">
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={1000}
              rows={3}
              className="border-border-subtle bg-card resize-none rounded-md border px-3 py-2 text-[12px]"
            />
          </Field>
          <div className="flex items-center gap-3">
            <span className="text-text-3 text-[11px]">Estado</span>
            <div className="border-border-subtle flex items-center gap-1 rounded-md border p-1">
              <button
                type="button"
                data-active={status === 'active'}
                onClick={() => setStatus('active')}
                className={
                  'rounded px-3 py-1 text-[12px] font-medium transition-colors ' +
                  (status === 'active'
                    ? 'bg-foreground text-background'
                    : 'text-text-2 hover:bg-subtle')
                }
              >
                Activo
              </button>
              <button
                type="button"
                data-active={status === 'inactive'}
                onClick={() => setStatus('inactive')}
                className={
                  'rounded px-3 py-1 text-[12px] font-medium transition-colors ' +
                  (status === 'inactive'
                    ? 'bg-foreground text-background'
                    : 'text-text-2 hover:bg-subtle')
                }
              >
                Inactivo
              </button>
            </div>
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
            onClick={() => mut.mutate(payload)}
            disabled={!canSubmit}
            className="bg-foreground text-background rounded-md px-3 py-1.5 text-[12px] font-medium disabled:opacity-40"
          >
            {mut.isPending ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1">
      <span className="text-text-3 text-[11px]">{label}</span>
      {children}
    </label>
  );
}
