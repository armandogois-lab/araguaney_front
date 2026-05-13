'use client';

import { fmtDateTime } from '@/lib/format/date';
import type { AuditEntry } from '@/lib/types/audit';

interface Props {
  entry: AuditEntry;
  onClose: () => void;
}

function isEmptyPayload(payload: unknown): boolean {
  if (payload === null || payload === undefined) return true;
  if (typeof payload !== 'object') return false;
  return Object.keys(payload as object).length === 0;
}

export function AuditDetailModal({ entry, onClose }: Props) {
  const payloadEmpty = isEmptyPayload(entry.payload);

  return (
    <div
      data-testid="audit-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card mt-16 w-full max-w-[640px] overflow-hidden rounded-xl"
      >
        <header className="border-border-subtle flex items-start justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-[16px] font-semibold tracking-[-0.2px]">
              {entry.action.toUpperCase()} · {entry.entity_type}
            </h2>
            <div className="text-text-3 mt-1 font-mono text-[11.5px]">
              {fmtDateTime(entry.occurred_at)}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="bg-subtle text-text-2 flex h-7 w-7 items-center justify-center rounded-md text-[14px]"
          >
            ×
          </button>
        </header>

        <div className="flex flex-col gap-5 px-6 py-5">
          <Block title="QUIÉN">
            <KV
              k="Actor"
              v={
                entry.actor ? (
                  <>
                    {entry.actor.full_name}{' '}
                    <span className="text-text-3">({entry.actor.email})</span>
                  </>
                ) : (
                  <span className="text-text-3 italic">sistema</span>
                )
              }
            />
            <KV k="IP" v={entry.ip_address ?? '—'} mono />
            <KV k="User-agent" v={entry.user_agent ?? '—'} mono last />
          </Block>

          <Block title="QUÉ">
            {payloadEmpty ? (
              <div className="text-text-3 py-2 text-[11px] italic">
                Sin datos adicionales en el payload.
              </div>
            ) : (
              <pre className="bg-subtle border-border-soft max-h-[400px] overflow-auto rounded-md border p-3 font-mono text-[11px] break-all whitespace-pre-wrap">
                {JSON.stringify(entry.payload, null, 2)}
              </pre>
            )}
          </Block>
        </div>

        <div className="border-border-subtle bg-card flex items-center justify-end gap-2 border-t px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="border-border-subtle bg-card text-text-2 hover:bg-subtle rounded-md border px-3 py-1.5 text-[12px] font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-text-3 mb-2 text-[10px] uppercase tracking-wide">{title}</div>
      {children}
    </div>
  );
}

function KV({
  k,
  v,
  mono = false,
  last = false,
}: {
  k: string;
  v: React.ReactNode;
  mono?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={
        'flex items-start justify-between gap-3 py-1.5 text-[12px] ' +
        (last ? '' : 'border-border-soft border-b')
      }
    >
      <span className="text-text-3 flex-shrink-0">{k}</span>
      <span
        className={
          'text-text-2 max-w-[60%] text-right break-all ' + (mono ? 'font-mono text-[11px]' : '')
        }
      >
        {v}
      </span>
    </div>
  );
}
