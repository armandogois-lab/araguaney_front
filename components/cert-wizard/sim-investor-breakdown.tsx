import { fmtMoney2 } from '@/lib/format/money';
import { fmtDate } from '@/lib/format/date';
import type { SimulationResult } from '@/lib/types/certificate';

interface Props {
  simulation: SimulationResult;
}

export function SimInvestorBreakdown({ simulation }: Props) {
  const capital = Number(simulation.capital);
  const returned = Number(simulation.investor_returned);
  const paid = Number(simulation.investor_paid);
  const yieldAmount = Number(simulation.investor_yield);
  const total = paid + yieldAmount;

  return (
    <div className="bg-card border-border-subtle rounded-lg border p-4">
      <div className="text-text-3 mb-3 text-[10px] uppercase tracking-wide">
        Resumen para el inversor
      </div>
      <Row label="Capital del inversor" amount={fmtMoney2(capital)} />
      <Row label="− No colocado (devolución)" amount={`-${fmtMoney2(returned)}`} muted />
      <RowHi label="Capital efectivamente colocado" amount={fmtMoney2(paid)} />
      <Row label="+ Intereses al vencimiento" amount={`+${fmtMoney2(yieldAmount)}`} muted />
      <RowFinal
        label={`Total a recibir el ${fmtDate(simulation.maturity_date)}`}
        amount={fmtMoney2(total)}
      />
    </div>
  );
}

function Row({ label, amount, muted = false }: { label: string; amount: string; muted?: boolean }) {
  return (
    <div className="border-border-subtle flex items-center justify-between border-b py-2">
      <span className={`text-[12px] ${muted ? 'text-text-3 italic' : ''}`}>{label}</span>
      <span className="text-[13px] font-medium tabular-nums">{amount}</span>
    </div>
  );
}

function RowHi({ label, amount }: { label: string; amount: string }) {
  return (
    <div className="bg-subtle -mx-4 flex items-center justify-between px-4 py-2.5">
      <span className="text-[13px]">{label}</span>
      <span className="text-[13px] font-semibold tabular-nums">{amount}</span>
    </div>
  );
}

function RowFinal({ label, amount }: { label: string; amount: string }) {
  return (
    <div className="bg-green-bg text-green-text -mx-4 mt-2 flex items-center justify-between px-4 py-3">
      <span className="text-[12px] font-medium">{label}</span>
      <span className="text-[14px] font-semibold tabular-nums">{amount}</span>
    </div>
  );
}
