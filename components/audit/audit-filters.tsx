'use client';

import type { AuditEntityType } from '@/lib/types/audit';

export type AuditEntityFilter = AuditEntityType | 'all';
export type AuditActionFilter = 'create' | 'update' | 'cancel' | 'grant' | 'revoke' | 'all';

export interface AuditFiltersValue {
  entityType: AuditEntityFilter;
  action: AuditActionFilter;
  dateFrom: string;
  dateTo: string;
}

interface Props {
  value: AuditFiltersValue;
  onChange: (next: AuditFiltersValue) => void;
}

const ENTITY_PILLS: Array<{ value: AuditEntityFilter; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'investor', label: 'Investor' },
  { value: 'batch', label: 'Batch' },
  { value: 'order', label: 'Order' },
  { value: 'setting', label: 'Setting' },
  { value: 'user', label: 'User' },
  { value: 'role_permission', label: 'Role-permission' },
];

const OTROS_OPTIONS: Array<{ value: AuditEntityType; label: string }> = [
  { value: 'installment', label: 'Installment' },
  { value: 'certificate_order', label: 'Certificate order' },
  { value: 'merchant', label: 'Merchant' },
  { value: 'end_user', label: 'End user' },
  { value: 'system', label: 'System' },
];

const ACTION_PILLS: Array<{ value: AuditActionFilter; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'create', label: 'Crear' },
  { value: 'update', label: 'Actualizar' },
  { value: 'cancel', label: 'Cancelar' },
  { value: 'grant', label: 'Otorgar' },
  { value: 'revoke', label: 'Revocar' },
];

export function AuditFilters({ value, onChange }: Props) {
  const otrosValues = new Set(OTROS_OPTIONS.map((o) => o.value));
  const otrosSelected = otrosValues.has(value.entityType as AuditEntityType)
    ? (value.entityType as AuditEntityType)
    : '';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-text-3 mr-1 text-[11px]">Entidad</span>
        <div className="border-border-subtle flex flex-wrap items-center gap-1 rounded-md border p-1">
          {ENTITY_PILLS.map((opt) => {
            const active = value.entityType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                data-active={active}
                onClick={() => onChange({ ...value, entityType: opt.value })}
                className={
                  'rounded px-3 py-1 text-[12px] font-medium transition-colors ' +
                  (active ? 'bg-foreground text-background' : 'text-text-2 hover:bg-subtle')
                }
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <select
          aria-label="Otros tipos"
          value={otrosSelected}
          onChange={(e) => {
            const next = e.target.value;
            if (next === '') return;
            onChange({ ...value, entityType: next as AuditEntityType });
          }}
          className="border-border-subtle bg-card rounded-md border px-2 py-1 text-[12px]"
        >
          <option value="">Otros…</option>
          {OTROS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-text-3 mr-1 text-[11px]">Acción</span>
        <div className="border-border-subtle flex items-center gap-1 rounded-md border p-1">
          {ACTION_PILLS.map((opt) => {
            const active = value.action === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                data-active={active}
                onClick={() => onChange({ ...value, action: opt.value })}
                className={
                  'rounded px-3 py-1 text-[12px] font-medium transition-colors ' +
                  (active ? 'bg-foreground text-background' : 'text-text-2 hover:bg-subtle')
                }
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <label className="ml-2 flex items-center gap-2 text-[11px]">
          <span className="text-text-3">Desde</span>
          <input
            type="date"
            aria-label="Desde"
            value={value.dateFrom}
            onChange={(e) => onChange({ ...value, dateFrom: e.target.value })}
            className="border-border-subtle bg-card rounded-md border px-2 py-1 text-[12px]"
          />
        </label>
        <label className="flex items-center gap-2 text-[11px]">
          <span className="text-text-3">Hasta</span>
          <input
            type="date"
            aria-label="Hasta"
            value={value.dateTo}
            onChange={(e) => onChange({ ...value, dateTo: e.target.value })}
            className="border-border-subtle bg-card rounded-md border px-2 py-1 text-[12px]"
          />
        </label>
      </div>
    </div>
  );
}
