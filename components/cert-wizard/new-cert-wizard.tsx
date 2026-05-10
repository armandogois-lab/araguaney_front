'use client';

import { useReducer, useState } from 'react';
import { initialWizardState, wizardReducer } from './wizard-state';
import { StepIndicator } from './step-indicator';
import { Step1Investor } from './step1-investor';
import { Step2Simulation } from './step2-simulation';
import { Step3Confirm } from './step3-confirm';
import { WizardFooter } from './wizard-footer';

interface Props {
  onClose: () => void;
}

export function NewCertWizard({ onClose }: Props) {
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
  const [step2RecalcTick, setStep2RecalcTick] = useState(0);
  const [step3ConfirmTick, setStep3ConfirmTick] = useState(0);
  const [busy, setBusy] = useState(false);

  return (
    <div
      data-testid="cert-wizard-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 p-12"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card w-full max-w-[880px] overflow-hidden rounded-xl"
      >
        <header className="border-border-subtle flex items-start justify-between border-b px-7 py-5">
          <div>
            <h2 className="text-[18px] font-semibold tracking-[-0.2px]">Nuevo certificado</h2>
            <div className="text-text-3 mt-1 text-[12px]">
              Empaqueta órdenes del stock disponible bajo las 3 reglas del producto.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="bg-subtle text-text-2 flex h-7 w-7 items-center justify-center rounded-md text-[14px]"
          >
            ×
          </button>
        </header>

        <StepIndicator current={state.step} />

        {state.step === 1 && (
          <Step1Investor
            onSelect={(investor) =>
              dispatch({
                type: 'SET_INVESTOR',
                investor: { id: investor.id, legal_name: investor.legal_name, rif: investor.rif },
              })
            }
          />
        )}

        {state.step === 2 && state.investor && (
          <Step2Simulation
            investor={state.investor}
            params={state.params}
            simulation={state.simulation}
            poolChangedWarning={state.poolChangedWarning}
            triggerRecalculate={step2RecalcTick > 0}
            onParamsChange={(p) => dispatch({ type: 'SET_PARAMS', params: p })}
            onSetSimulation={(sim) => dispatch({ type: 'SET_SIMULATION', simulation: sim })}
            onChangeInvestor={() => dispatch({ type: 'GO_TO_STEP', step: 1 })}
          />
        )}

        {state.step === 3 && state.simulation && (
          <Step3Confirm
            simulation={state.simulation}
            triggerConfirm={step3ConfirmTick > 0}
            onPoolChanged={() => {
              dispatch({ type: 'POOL_CHANGED' });
              setStep3ConfirmTick(0);
            }}
            onSuccess={() => onClose()}
            onConfirmStart={() => setBusy(true)}
            onConfirmEnd={() => setBusy(false)}
          />
        )}

        <WizardFooter
          step={state.step}
          hasSimulation={state.simulation !== null}
          canContinue={
            (state.step === 1 && state.investor !== null) ||
            (state.step === 2 && state.simulation !== null) ||
            state.step === 3
          }
          busy={busy}
          onCancel={onClose}
          onBack={() =>
            dispatch({
              type: 'GO_TO_STEP',
              step: (state.step - 1) as 1 | 2,
            })
          }
          onContinue={() => {
            if (state.step === 1) dispatch({ type: 'GO_TO_STEP', step: 2 });
            else if (state.step === 2) dispatch({ type: 'GO_TO_STEP', step: 3 });
          }}
          onRecalculate={() => setStep2RecalcTick((t) => t + 1)}
          onConfirm={() => {
            if (state.step === 2) dispatch({ type: 'GO_TO_STEP', step: 3 });
            else if (state.step === 3) setStep3ConfirmTick((t) => t + 1);
          }}
        />
      </div>
    </div>
  );
}
