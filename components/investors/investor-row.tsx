'use client';

import { fmtMoney2 } from '@/lib/format/money';
import type { InvestorSummary } from '@/lib/types/investor';
import { InvestorStatusPill } from './investor-status-pill';

interface Props {
  investor: InvestorSummary;
  onEdit?: (investor: InvestorSummary) => void;
}

export function InvestorRow({ investor, onEdit }: Props) {
  const capital = Number(investor.total_invested);
  const interactive = !!onEdit;
  return (
    <tr
      onClick={onEdit ? () => onEdit(investor) : undefined}
      className={
        'border-border-soft border-b transition-colors ' +
        (interactive ? 'hover:bg-subtle cursor-pointer' : '')
      }
    >
      <td className="px-4 py-3.5 font-medium">{investor.legal_name}</td>
      <td className="text-text-2 px-4 py-3.5 font-mono text-[11.5px]">{investor.rif}</td>
      <td className="num px-4 py-3.5 text-right">{investor.active_cert_count}</td>
      <td className="num px-4 py-3.5 text-right font-medium">
        {capital === 0 ? <span className="text-text-3">—</span> : fmtMoney2(capital)}
      </td>
      <td className="px-4 py-3.5">
        <InvestorStatusPill status={investor.status} />
      </td>
    </tr>
  );
}
