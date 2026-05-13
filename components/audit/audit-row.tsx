'use client';

import { fmtDateTime } from '@/lib/format/date';
import type { AuditEntry } from '@/lib/types/audit';
import { AuditActionPill } from './audit-action-pill';
import { AuditEntityLink } from './audit-entity-link';

interface Props {
  entry: AuditEntry;
  onSelect: (entry: AuditEntry) => void;
}

export function AuditRow({ entry, onSelect }: Props) {
  return (
    <tr
      onClick={() => onSelect(entry)}
      className="border-border-soft hover:bg-subtle cursor-pointer border-b transition-colors"
    >
      <td className="num px-4 py-3 text-[11.5px]">{fmtDateTime(entry.occurred_at)}</td>
      <td className="max-w-[220px] truncate px-4 py-3 text-[12px]" title={entry.actor?.email ?? ''}>
        {entry.actor ? entry.actor.full_name : <span className="text-text-3 italic">sistema</span>}
      </td>
      <td className="px-4 py-3">
        <AuditActionPill action={entry.action} />
      </td>
      <td className="text-text-2 px-4 py-3 text-[11.5px]">{entry.entity_type}</td>
      <td className="max-w-[200px] truncate px-4 py-3">
        <AuditEntityLink entityType={entry.entity_type} entityId={entry.entity_id} />
      </td>
      <td className="text-text-3 max-w-[140px] truncate px-4 py-3 font-mono text-[11px]">
        {entry.ip_address ?? '—'}
      </td>
    </tr>
  );
}
