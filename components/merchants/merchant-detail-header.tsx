import { PageHeader } from '@/components/layout/page-header';
import { fmtDate } from '@/lib/format/date';

interface Props {
  currentName: string;
  rif: string;
  firstSeenAt: string;
  lastSeenAt: string;
}

export function MerchantDetailHeader({ currentName, rif, firstSeenAt, lastSeenAt }: Props) {
  return (
    <div>
      <PageHeader
        breadcrumb={{ section: 'Datos', current: 'Comercios' }}
        title={currentName}
      />
      <div className="text-text-3 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px]">
        <span>
          RIF: <span className="font-mono">{rif}</span>
        </span>
        <span>·</span>
        <span>
          Primera aparición: <span className="tabular-nums">{fmtDate(firstSeenAt)}</span>
        </span>
        <span>·</span>
        <span>
          Última: <span className="tabular-nums">{fmtDate(lastSeenAt)}</span>
        </span>
      </div>
    </div>
  );
}
