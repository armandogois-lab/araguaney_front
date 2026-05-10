'use client';

import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { simulateCertificate } from '@/lib/api/certificates';
import { fmtMoney2 } from '@/lib/format/money';
import { fmtPct } from '@/lib/format/percent';
import { fmtDate } from '@/lib/format/date';
import type { SimulationResult, CertificateTermDays } from '@/lib/types/certificate';
import { SimForm } from './sim-form';
import { SimRulesBadge } from './sim-rules-badge';
import { SimStatCards } from './sim-stat-cards';
import { SimInvestorBreakdown } from './sim-investor-breakdown';
import { SimConcentrationBars } from './sim-concentration-bars';
import { SimMaturityTimeline } from './sim-maturity-timeline';

interface Params {
  capital: string;
  rate: string;
  term_days: CertificateTermDays;
  issue_date: string;
}

interface Props {
  investor: { id: string; legal_name: string; rif: string };
  params: Params;
  simulation: SimulationResult | null;
  poolChangedWarning: boolean;
  triggerRecalculate: boolean;
  onParamsChange: (next: Partial<Params>) => void;
  onSetSimulation: (sim: SimulationResult) => void;
  onChangeInvestor: () => void;
}

export function Step2Simulation({
  investor,
  params,
  simulation,
  poolChangedWarning,
  triggerRecalculate,
  onParamsChange,
  onSetSimulation,
  onChangeInvestor,
}: Props) {
  const mut = useMutation({
    mutationFn: simulateCertificate,
    onSuccess: (data) => onSetSimulation(data),
  });

  useEffect(() => {
    if (triggerRecalculate) {
      mut.mutate({
        investor_id: investor.id,
        capital: Number(params.capital),
        rate: Number(params.rate),
        term_days: params.term_days,
        issue_date: params.issue_date,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRecalculate]);

  return (
    <div className="grid grid-cols-[320px_1fr] gap-6 px-7 py-6">
      <SimForm
        investor={investor}
        params={params}
        onParamsChange={onParamsChange}
        onChangeInvestor={onChangeInvestor}
      />
      <div className="flex flex-col gap-3">
        {poolChangedWarning && (
          <div className="bg-warn-bg text-warn-text rounded-md px-3 py-2 text-[12px]">
            El pool cambió mientras revisabas. Recalculá para volver a emitir.
          </div>
        )}
        {mut.isPending && <div className="text-text-3 py-12 text-center text-sm">Simulando…</div>}
        {mut.isError && !mut.isPending && (
          <div className="bg-warn-bg text-warn-text rounded-md px-3 py-2 text-[12px]">
            {mut.error instanceof Error ? mut.error.message : 'Error al simular. Reintentá.'}
          </div>
        )}
        {!mut.isPending && !mut.isError && !simulation && (
          <div className="border-border-subtle bg-subtle flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
            <div className="text-text-3 text-center text-sm">
              Llená los parámetros y hacé click en Recalcular.
            </div>
          </div>
        )}
        {simulation && (
          <>
            <div className="flex items-center justify-between">
              <SimRulesBadge />
              <CalcSummary simulation={simulation} />
            </div>
            <SimStatCards simulation={simulation} />
            <SimInvestorBreakdown simulation={simulation} />
            <SimConcentrationBars items={simulation.concentration_top} />
            <SimMaturityTimeline items={simulation.due_date_distribution} />
          </>
        )}
      </div>
    </div>
  );
}

function CalcSummary({ simulation }: { simulation: SimulationResult }) {
  return (
    <div className="text-text-3 flex items-center gap-3 text-[10px] tabular-nums">
      <span>Vence {fmtDate(simulation.maturity_date)}</span>
      <span>·</span>
      <span>Precio {fmtPct(simulation.price, 4)}</span>
      <span>·</span>
      <span>Nominal {fmtMoney2(Number(simulation.nominal_target))}</span>
    </div>
  );
}
