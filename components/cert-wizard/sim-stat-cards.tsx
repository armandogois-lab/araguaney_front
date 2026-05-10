import { fmtMoney2 } from '@/lib/format/money';
import type { SimulationResult } from '@/lib/types/certificate';

interface Props {
  simulation: SimulationResult;
}

export function SimStatCards({ simulation }: Props) {
  const numOrders = simulation.selected_orders.length;
  const eligibleSub =
    typeof simulation.total_eligible_merchants === 'number'
      ? `${simulation.total_eligible_merchants} elegibles`
      : 'distintos RIF';
  return (
    <div className="grid grid-cols-2 gap-2">
      <Card
        label="Comercios"
        value={String(simulation.total_distinct_merchants)}
        sub={eligibleSub}
      />
      <Card label="Órdenes" value={String(numOrders)} sub="empaquetadas" />
      <Card
        label="Retorno al vencimiento"
        value={fmtMoney2(Number(simulation.nominal_actual))}
        sub="nominal actual"
      />
      <Card
        label="Plazo cuotas"
        value={`${simulation.installment_plazo_days.min}—${simulation.installment_plazo_days.max}d`}
        sub="dentro del límite"
      />
    </div>
  );
}

function Card({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-card border-border-subtle rounded-lg border p-3">
      <div className="text-text-3 text-[10px] uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-[16px] font-semibold tabular-nums tracking-[-0.3px]">{value}</div>
      <div className="text-text-3 mt-0.5 text-[10px]">{sub}</div>
    </div>
  );
}
