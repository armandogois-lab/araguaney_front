'use client';

import type { CertificateTermDays } from '@/lib/types/certificate';

interface Investor {
  id: string;
  legal_name: string;
  rif: string;
}

interface Params {
  capital: string;
  rate: string;
  term_days: CertificateTermDays;
  issue_date: string;
}

interface Props {
  investor: Investor;
  params: Params;
  onParamsChange: (next: Partial<Params>) => void;
  onChangeInvestor: () => void;
}

export function SimForm({ investor, params, onParamsChange, onChangeInvestor }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-text-3 text-[10px] uppercase tracking-wide">Parámetros</div>

      <div>
        <span className="text-text-3 mb-1 block text-[11px]">Inversor</span>
        <div className="border-border-subtle bg-subtle flex items-center justify-between rounded-md border p-3">
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium">{investor.legal_name}</div>
            <div className="text-text-3 mt-0.5 font-mono text-[10px]">{investor.rif}</div>
          </div>
          <button
            type="button"
            onClick={onChangeInvestor}
            className="text-text-3 text-[10px] hover:underline"
          >
            Cambiar
          </button>
        </div>
      </div>

      <Field label="Capital del inversor" id="capital">
        <div className="relative">
          <span className="text-text-3 absolute left-3 top-1/2 -translate-y-1/2 text-[12px]">
            $
          </span>
          <input
            id="capital"
            type="number"
            inputMode="decimal"
            value={params.capital}
            onChange={(e) => onParamsChange({ capital: e.target.value })}
            className="border-border-subtle bg-card w-full rounded-md border py-2 pl-6 pr-3 text-[13px] tabular-nums"
          />
        </div>
      </Field>

      <Field label="Plazo del certificado" id="term">
        <div className="border-border-subtle grid grid-cols-2 gap-0 rounded-md border p-1">
          {[14, 42].map((t) => {
            const active = params.term_days === t;
            return (
              <button
                key={t}
                type="button"
                data-active={active}
                onClick={() => onParamsChange({ term_days: t as CertificateTermDays })}
                className={
                  'rounded py-2 text-[12px] font-medium transition-colors ' +
                  (active ? 'bg-foreground text-background' : 'text-text-2 hover:bg-subtle')
                }
              >
                {t} días
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Tasa anual" id="rate">
        <div className="relative">
          <input
            id="rate"
            type="number"
            inputMode="decimal"
            step="0.1"
            value={(Number(params.rate) * 100).toFixed(1).replace(/\.0$/, '')}
            onChange={(e) => onParamsChange({ rate: String(Number(e.target.value) / 100) })}
            className="border-border-subtle bg-card w-full rounded-md border py-2 pl-3 pr-6 text-[13px] tabular-nums"
          />
          <span className="text-text-3 absolute right-3 top-1/2 -translate-y-1/2 text-[12px]">
            %
          </span>
        </div>
      </Field>

      <Field label="Fecha de emisión" id="issue_date">
        <input
          id="issue_date"
          type="date"
          value={params.issue_date}
          onChange={(e) => onParamsChange({ issue_date: e.target.value })}
          min={new Date().toISOString().slice(0, 10)}
          className="border-border-subtle bg-card w-full rounded-md border px-3 py-2 text-[13px]"
        />
      </Field>
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-text-3 mb-1 block text-[11px]">
        {label}
      </label>
      {children}
    </div>
  );
}
