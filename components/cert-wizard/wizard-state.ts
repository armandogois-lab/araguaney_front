import type { SimulationResult, CertificateTermDays } from '@/lib/types/certificate';

export interface WizardState {
  step: 1 | 2 | 3;
  investor: { id: string; legal_name: string; rif: string } | null;
  params: {
    capital: string;
    rate: string;
    term_days: CertificateTermDays;
    issue_date: string;
  };
  simulation: SimulationResult | null;
  poolChangedWarning: boolean;
}

function todayIso(): string {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const initialWizardState: WizardState = {
  step: 1,
  investor: null,
  params: {
    capital: '100000',
    rate: '0.13',
    term_days: 42,
    issue_date: todayIso(),
  },
  simulation: null,
  poolChangedWarning: false,
};

export type WizardAction =
  | { type: 'SET_INVESTOR'; investor: WizardState['investor'] }
  | { type: 'SET_PARAMS'; params: Partial<WizardState['params']> }
  | { type: 'SET_SIMULATION'; simulation: SimulationResult }
  | { type: 'GO_TO_STEP'; step: 1 | 2 | 3 }
  | { type: 'POOL_CHANGED' };

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_INVESTOR':
      return { ...state, investor: action.investor, step: 2 };
    case 'SET_PARAMS':
      return {
        ...state,
        params: { ...state.params, ...action.params },
        simulation: null,
      };
    case 'SET_SIMULATION':
      return { ...state, simulation: action.simulation, poolChangedWarning: false };
    case 'GO_TO_STEP':
      return { ...state, step: action.step };
    case 'POOL_CHANGED':
      return { ...state, step: 2, simulation: null, poolChangedWarning: true };
  }
}
