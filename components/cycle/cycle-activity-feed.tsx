'use client';

import type { UseQueryResult } from '@tanstack/react-query';
import { fmtRelativeTime } from '@/lib/format/date';
import type { AuditEntry, AuditListResponse } from '@/lib/types/audit';

interface Props {
  auditQ: UseQueryResult<AuditListResponse>;
}

const VISIBLE_LIMIT = 5;

const VERBS: Record<string, string> = {
  create: 'creó',
  update: 'actualizó',
  cancel: 'canceló',
  grant: 'otorgó permiso a',
  revoke: 'revocó permiso de',
};

const ENTITY_LABELS: Record<string, string> = {
  batch: 'lote',
  order: 'orden',
  installment: 'cuota',
  certificate: 'certificado',
  certificate_order: 'asignación de orden',
  investor: 'inversor',
  merchant: 'comercio',
  end_user: 'usuario final',
  user: 'usuario',
  setting: 'configuración',
  role_permission: 'permiso',
  system: 'sistema',
};

function entityLabel(t: string): string {
  return ENTITY_LABELS[t] ?? t;
}

function verb(a: string): string {
  return VERBS[a] ?? a;
}

function entityIdentifier(entry: AuditEntry): string {
  if (!entry.entity_id) return '';
  if (entry.entity_type === 'certificate') {
    const code = (entry.payload as { certificate_code?: string } | null)?.certificate_code;
    if (code) return code;
  }
  return entry.entity_id.slice(0, 8);
}

export function formatActivityEntry(entry: AuditEntry): { node: React.ReactNode } {
  const actorNode = entry.actor ? (
    <b className="text-text-2 font-medium">{entry.actor.full_name}</b>
  ) : (
    <span className="text-text-3 italic">sistema</span>
  );
  const id = entityIdentifier(entry);
  const idNode = id ? <span className="font-mono text-[11px]"> {id}</span> : null;
  return {
    node: (
      <>
        {actorNode} {verb(entry.action)} {entityLabel(entry.entity_type)}
        {idNode}
      </>
    ),
  };
}

export function CycleActivityFeed({ auditQ }: Props) {
  return (
    <div className="bg-card border-border-subtle overflow-hidden rounded-xl border">
      <div className="border-border-subtle border-b px-5 py-3">
        <h3 className="text-[13px] font-semibold tracking-[-0.2px]">Actividad reciente</h3>
      </div>
      <Body q={auditQ} />
    </div>
  );
}

function Body({ q }: { q: UseQueryResult<AuditListResponse> }) {
  if (q.isLoading) return <Centered>Cargando actividad…</Centered>;
  if (q.isError || !q.data) return <Centered>No se pudo cargar.</Centered>;
  if (q.data.data.length === 0) return <Centered italic>Sin actividad esta semana.</Centered>;
  const rows = q.data.data.slice(0, VISIBLE_LIMIT);
  return (
    <div className="px-5 py-2">
      {rows.map((e) => {
        const { node } = formatActivityEntry(e);
        return (
          <div key={e.id} className="text-text-2 flex gap-3 py-1.5 text-[11.5px]">
            <span className="text-text-3 w-16 flex-shrink-0 tabular-nums">
              {fmtRelativeTime(e.occurred_at)}
            </span>
            <span className="leading-snug">{node}</span>
          </div>
        );
      })}
    </div>
  );
}

function Centered({ children, italic = false }: { children: React.ReactNode; italic?: boolean }) {
  return (
    <div
      className={
        'text-text-3 flex h-24 items-center justify-center px-5 text-sm ' + (italic ? 'italic' : '')
      }
    >
      {children}
    </div>
  );
}
