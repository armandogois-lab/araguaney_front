import { describe, it, expect } from 'vitest';
import { wizardReducer, initialWizardState, type WizardState } from './wizard-state';

const inv = { id: 'inv-1', legal_name: 'Alpha', rif: 'J-1' };

describe('wizardReducer', () => {
  it('starts at step 1 with no investor + no simulation', () => {
    expect(initialWizardState.step).toBe(1);
    expect(initialWizardState.investor).toBeNull();
    expect(initialWizardState.simulation).toBeNull();
    expect(initialWizardState.params.term_days).toBe(42);
  });

  it('SET_INVESTOR sets investor and advances to step 2', () => {
    const next = wizardReducer(initialWizardState, { type: 'SET_INVESTOR', investor: inv });
    expect(next.investor).toEqual(inv);
    expect(next.step).toBe(2);
  });

  it('SET_PARAMS merges partial params + clears simulation', () => {
    const withSim: WizardState = {
      ...initialWizardState,
      step: 2,
      simulation: { payload_hash: 'x' } as never,
    };
    const next = wizardReducer(withSim, { type: 'SET_PARAMS', params: { capital: '50000' } });
    expect(next.params.capital).toBe('50000');
    expect(next.params.term_days).toBe(42);
    expect(next.simulation).toBeNull();
  });

  it('SET_SIMULATION stores result and clears poolChangedWarning', () => {
    const next = wizardReducer(
      { ...initialWizardState, poolChangedWarning: true },
      { type: 'SET_SIMULATION', simulation: { payload_hash: 'h' } as never },
    );
    expect(next.simulation).toEqual({ payload_hash: 'h' });
    expect(next.poolChangedWarning).toBe(false);
  });

  it('GO_TO_STEP changes step', () => {
    const s2: WizardState = { ...initialWizardState, investor: inv, step: 2 };
    expect(wizardReducer(s2, { type: 'GO_TO_STEP', step: 3 }).step).toBe(3);
    expect(wizardReducer(s2, { type: 'GO_TO_STEP', step: 1 }).step).toBe(1);
  });

  it('POOL_CHANGED sets warning + drops simulation + returns to step 2', () => {
    const s3: WizardState = {
      ...initialWizardState,
      step: 3,
      investor: inv,
      simulation: { payload_hash: 'x' } as never,
    };
    const next = wizardReducer(s3, { type: 'POOL_CHANGED' });
    expect(next.step).toBe(2);
    expect(next.poolChangedWarning).toBe(true);
    expect(next.simulation).toBeNull();
  });
});
