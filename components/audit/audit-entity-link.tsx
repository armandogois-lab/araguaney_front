import Link from 'next/link';
import type { AuditEntityType } from '@/lib/types/audit';

interface Props {
  entityType: AuditEntityType;
  entityId: string | null;
}

export function AuditEntityLink({ entityType, entityId }: Props) {
  if (!entityId) return <span className="text-text-3">—</span>;
  if (entityType === 'certificate') {
    return (
      <Link
        href={`/certificates/${entityId}`}
        className="text-text-2 font-mono text-[11.5px] hover:underline"
      >
        {entityId}
      </Link>
    );
  }
  return <span className="text-text-2 font-mono text-[11.5px]">{entityId}</span>;
}
