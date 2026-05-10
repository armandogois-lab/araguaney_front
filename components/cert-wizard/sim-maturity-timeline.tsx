import type { SimDueDateItem } from '@/lib/types/certificate';

interface Props {
  items: SimDueDateItem[];
}

const MAX_POINTS = 8;

function shortDate(iso: string): string {
  const [, m, d] = iso.split('-');
  return `${d}/${m}`;
}

/**
 * Compact money format for the timeline labels: $11,551.23 → "$11.5k", etc.
 * The full-precision figures live in the breakdown panel above; the timeline
 * only needs to convey relative magnitudes.
 */
function fmtMoneyCompact(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${Math.round(n)}`;
}

/**
 * If the back returns more than MAX_POINTS distinct due dates, fold the tail
 * into the last bucket so the timeline doesn't horizontally overflow the
 * preview column. We keep the first MAX_POINTS-1 dates as-is and aggregate
 * the rest into a single trailing bucket labeled with the last date.
 */
function bucketize(items: SimDueDateItem[]): SimDueDateItem[] {
  if (items.length <= MAX_POINTS) return items;
  const head = items.slice(0, MAX_POINTS - 1);
  const tail = items.slice(MAX_POINTS - 1);
  const lastDate = tail[tail.length - 1].date;
  const tailSum = tail.reduce((acc, it) => acc + Number(it.amount), 0);
  return [...head, { date: lastDate, amount: String(tailSum) }];
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
  const display = bucketize(items);
  const truncated = items.length > MAX_POINTS;
  return (
    <div className="bg-card border-border-subtle rounded-lg border p-4">
      <div className="text-text-3 mb-3 flex items-center justify-between text-[10px] uppercase tracking-wide">
        <span>Distribución de vencimientos</span>
        {truncated && (
          <span className="text-text-3 normal-case tracking-normal">
            {items.length} fechas (último punto agrupa {items.length - MAX_POINTS + 1})
          </span>
        )}
      </div>
      <div className="relative flex items-start justify-between gap-2 px-1">
        <div className="bg-border-subtle absolute left-[8%] right-[8%] top-[4px] h-[1px]" />
        {display.map((p) => (
          <div key={p.date} className="relative z-10 flex min-w-0 flex-1 flex-col items-center">
            <div className="bg-foreground border-foreground mb-2 h-2 w-2 rounded-full border-2 box-content" />
            <div className="text-[10px] font-semibold tabular-nums">{shortDate(p.date)}</div>
            <div className="text-text-3 mt-0.5 text-[9px] tabular-nums">
              {fmtMoneyCompact(Number(p.amount))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
