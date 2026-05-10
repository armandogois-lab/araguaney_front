import { fmtMoney } from '@/lib/format/money';
import type { SimDueDateItem } from '@/lib/types/certificate';

interface Props {
  items: SimDueDateItem[];
}

function shortDate(iso: string): string {
  const [, m, d] = iso.split('-');
  return `${d}/${m}`;
}

export function SimMaturityTimeline({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="bg-card border-border-subtle rounded-lg border p-4">
        <div className="text-text-3 mb-3 text-[10px] uppercase tracking-wide">
          Distribución de vencimientos
        </div>
        <div className="text-text-3 py-6 text-center text-[12px]">
          Sin distribución de vencimientos.
        </div>
      </div>
    );
  }
  return (
    <div className="bg-card border-border-subtle rounded-lg border p-4">
      <div className="text-text-3 mb-3 text-[10px] uppercase tracking-wide">
        Distribución de vencimientos
      </div>
      <div className="relative flex items-start justify-between gap-2 px-1">
        <div className="bg-border-subtle absolute left-[8%] right-[8%] top-[4px] h-[1px]" />
        {items.map((p) => (
          <div key={p.date} className="relative z-10 flex flex-1 flex-col items-center">
            <div className="bg-foreground border-foreground mb-2 h-2 w-2 rounded-full border-2 box-content" />
            <div className="text-[10px] font-semibold tabular-nums">{shortDate(p.date)}</div>
            <div className="text-text-3 mt-0.5 text-[9px] tabular-nums">
              {fmtMoney(Number(p.amount))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
