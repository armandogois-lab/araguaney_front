import { fmtMoney2 } from '@/lib/format/money';

interface Props {
  orderCount: number;
  totalAmount: string;
}

export function MerchantKpiStrip({ orderCount, totalAmount }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <Card label="Órdenes totales" value={orderCount.toLocaleString('en-US')} />
      <Card label="Monto total" value={fmtMoney2(Number(totalAmount))} />
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border-border-subtle rounded-xl border p-5">
      <div className="text-text-3 mb-1 text-[10px] uppercase tracking-wide">{label}</div>
      <div className="text-[20px] font-semibold tabular-nums tracking-[-0.3px]">{value}</div>
    </div>
  );
}
