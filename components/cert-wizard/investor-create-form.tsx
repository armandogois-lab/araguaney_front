'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createInvestor } from '@/lib/api/investors';
import type { InvestorSummary } from '@/lib/types/investor';

interface Props {
  onCreated: (investor: InvestorSummary) => void;
}

type Kind = 'juridica' | 'natural';

const PREFIX: Record<Kind, string> = { juridica: 'J-', natural: 'V-' };

function swapPrefix(rif: string, nextKind: Kind): string {
  const next = PREFIX[nextKind];
  const other = nextKind === 'juridica' ? 'V-' : 'J-';
  if (rif === '' || rif === other) return next;
  if (rif.startsWith(other)) return next + rif.slice(other.length);
  if (rif.startsWith(next)) return rif;
  return next + rif;
}

export function InvestorCreateForm({ onCreated }: Props) {
  const [kind, setKind] = useState<Kind>('juridica');
  const [legalName, setLegalName] = useState('');
  const [rif, setRif] = useState(PREFIX.juridica);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const qc = useQueryClient();

  function changeKind(nextKind: Kind) {
    setKind(nextKind);
    setRif((r) => swapPrefix(r, nextKind));
  }

  const mut = useMutation({
    mutationFn: createInvestor,
    onSuccess: (inv) => {
      qc.invalidateQueries({ queryKey: ['investors'] });
      onCreated(inv);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'No se pudo crear el inversor');
    },
  });

  const rifPrefix = PREFIX[kind];
  const rifBody = rif.startsWith(rifPrefix) ? rif.slice(rifPrefix.length) : rif;
  const canSubmit = legalName.trim().length > 0 && rifBody.trim().length > 0 && !mut.isPending;

  function handleSubmit() {
    setError(null);
    mut.mutate({
      legal_name: legalName.trim(),
      rif: rif.trim(),
      kind,
      email: email.trim() || null,
      phone: phone.trim() || null,
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <fieldset className="flex flex-col gap-1">
        <legend className="text-text-3 text-[11px]">Tipo *</legend>
        <div className="mt-1 flex items-center gap-4">
          <label className="flex items-center gap-2 text-[12px]">
            <input
              type="radio"
              name="kind"
              checked={kind === 'juridica'}
              onChange={() => changeKind('juridica')}
            />
            Jurídica
          </label>
          <label className="flex items-center gap-2 text-[12px]">
            <input
              type="radio"
              name="kind"
              checked={kind === 'natural'}
              onChange={() => changeKind('natural')}
            />
            Natural
          </label>
        </div>
      </fieldset>
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
      <Field label="RIF *" id="rif">
        <input
          id="rif"
          type="text"
          value={rif}
          onChange={(e) => setRif(e.target.value)}
          maxLength={50}
          className="border-border-subtle bg-card rounded-md border px-3 py-2 font-mono text-[12px]"
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
      {error && (
        <div className="bg-warn-bg text-warn-text rounded-md px-3 py-2 text-[12px]">{error}</div>
      )}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="bg-foreground text-background mt-2 self-start rounded-md px-4 py-2 text-[12px] font-medium disabled:opacity-40"
      >
        {mut.isPending ? 'Creando…' : 'Crear inversor'}
      </button>
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
