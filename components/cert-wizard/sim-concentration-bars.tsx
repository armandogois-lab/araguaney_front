import { fmtMoney2 } from '@/lib/format/money';
import { fmtPct } from '@/lib/format/percent';
import type { SimConcentrationItem } from '@/lib/types/certificate';

interface Props {
  items: SimConcentrationItem[];
}

export function SimConcentrationBars({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="bg-card border-border-subtle rounded-lg border p-4">
        <div className="text-text-3 mb-3 text-[10px] uppercase tracking-wide">
          Concentración por comercio
        </div>
        <div className="text-text-3 py-6 text-center text-[12px]">Sin datos de concentración.</div>
      </div>
    );
  }
  const max = items.reduce((m, it) => Math.max(m, Number(it.amount)), 0);
  return (
    <div className="bg-card border-border-subtle rounded-lg border p-4">
      <div className="text-text-3 mb-3 text-[10px] uppercase tracking-wide">
        Concentración por comercio (top {items.length})
      </div>
      <div className="grid grid-cols-[1fr_70px_120px] items-center gap-3">
        {items.map((it) => {
          const widthPct = max > 0 ? (Number(it.amount) / max) * 100 : 0;
          return (
            <div key={it.merchant_id} className="contents">
              <div className="truncate text-[12px] font-medium" title={it.current_name}>
                {it.current_name}
              </div>
              <div className="bg-subtle h-1 w-full overflow-hidden rounded">
                <div
                  data-testid="conc-bar"
                  style={{ width: `${widthPct}%` }}
                  className="bg-foreground h-full"
                />
              </div>
              <div className="text-text-3 text-right text-[11px] tabular-nums">
                {fmtMoney2(Number(it.amount))} · {fmtPct(it.pct)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
