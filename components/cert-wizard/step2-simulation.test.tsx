import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { Step2Simulation } from './step2-simulation';

const { mockSimulate } = vi.hoisted(() => ({ mockSimulate: vi.fn() }));

vi.mock('@/lib/api/certificates', () => ({
  simulateCertificate: (...a: unknown[]) => mockSimulate(...a),
}));

const investor = { id: 'inv-1', legal_name: 'Alpha', rif: 'J-1' };
const params = {
  capital: '100000',
  rate: '0.13',
  term_days: 42 as const,
  issue_date: '2026-05-10',
};

const mockSim = {
  investor,
  capital: '100000',
  rate: '0.13',
  term_days: 42 as const,
  issue_date: '2026-05-10',
  maturity_date: '2026-06-21',
  price: '0.984833',
  nominal_target: '101540.6000',
  nominal_actual: '101540.0000',
  investor_paid: '99999.4100',
  investor_returned: '0.5900',
  investor_yield: '1540.5900',
  shortfall_pct: '0.000006',
  selected_orders: [],
  total_eligible_merchants: 100,
  total_distinct_merchants: 71,
  installment_plazo_days: { min: 7, max: 42 },
  concentration_top: [],
  due_date_distribution: [],
  payload_hash: 'abc',
};

describe('<Step2Simulation />', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows initial placeholder before recalculate', () => {
    renderWithQuery(
      <Step2Simulation
        investor={investor}
        params={params}
        simulation={null}
        poolChangedWarning={false}
        onParamsChange={vi.fn()}
        onSetSimulation={vi.fn()}
        onChangeInvestor={vi.fn()}
        triggerRecalculate={false}
      />,
    );
    expect(screen.getByText(/llen[aá] los par[aá]metros/i)).toBeInTheDocument();
  });

  it('triggerRecalculate=true fires the simulate mutation', async () => {
    mockSimulate.mockResolvedValueOnce(mockSim);
    const onSetSimulation = vi.fn();
    renderWithQuery(
      <Step2Simulation
        investor={investor}
        params={params}
        simulation={null}
        poolChangedWarning={false}
        onParamsChange={vi.fn()}
        onSetSimulation={onSetSimulation}
        onChangeInvestor={vi.fn()}
        triggerRecalculate={true}
      />,
    );
    await waitFor(() => expect(mockSimulate).toHaveBeenCalled());
    await waitFor(() => expect(onSetSimulation).toHaveBeenCalledWith(mockSim));
  });

  it('renders preview panels when simulation prop is provided', () => {
    renderWithQuery(
      <Step2Simulation
        investor={investor}
        params={params}
        simulation={mockSim}
        poolChangedWarning={false}
        onParamsChange={vi.fn()}
        onSetSimulation={vi.fn()}
        onChangeInvestor={vi.fn()}
        triggerRecalculate={false}
      />,
    );
    expect(screen.getByText(/las 3 reglas se cumplen/i)).toBeInTheDocument();
    expect(screen.getByText('71')).toBeInTheDocument();
  });

  it('shows poolChangedWarning banner when prop is true', () => {
    renderWithQuery(
      <Step2Simulation
        investor={investor}
        params={params}
        simulation={null}
        poolChangedWarning={true}
        onParamsChange={vi.fn()}
        onSetSimulation={vi.fn()}
        onChangeInvestor={vi.fn()}
        triggerRecalculate={false}
      />,
    );
    expect(screen.getByText(/el pool cambi/i)).toBeInTheDocument();
  });

  it('shows error message on simulate failure', async () => {
    mockSimulate.mockRejectedValueOnce(new Error('No hay órdenes elegibles'));
    renderWithQuery(
      <Step2Simulation
        investor={investor}
        params={params}
        simulation={null}
        poolChangedWarning={false}
        onParamsChange={vi.fn()}
        onSetSimulation={vi.fn()}
        onChangeInvestor={vi.fn()}
        triggerRecalculate={true}
      />,
    );
    await waitFor(() =>
      expect(screen.getByText(/no hay [oó]rdenes elegibles/i)).toBeInTheDocument(),
    );
  });
});
