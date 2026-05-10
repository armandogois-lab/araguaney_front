import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { NewCertWizard } from './new-cert-wizard';

const { mockListInvestors, mockSimulate, mockIssue, mockCreate } = vi.hoisted(() => ({
  mockListInvestors: vi.fn(),
  mockSimulate: vi.fn(),
  mockIssue: vi.fn(),
  mockCreate: vi.fn(),
}));

vi.mock('@/lib/api/investors', () => ({
  listInvestors: (...a: unknown[]) => mockListInvestors(...a),
  createInvestor: (...a: unknown[]) => mockCreate(...a),
}));

vi.mock('@/lib/api/certificates', () => ({
  simulateCertificate: (...a: unknown[]) => mockSimulate(...a),
  issueCertificate: (...a: unknown[]) => mockIssue(...a),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const investor = {
  id: 'inv-1',
  legal_name: 'Alpha',
  rif: 'J-1',
  kind: 'juridica' as const,
  status: 'active' as const,
  email: null,
  phone: null,
};

const mockSim = {
  investor: { id: 'inv-1', legal_name: 'Alpha', rif: 'J-1' },
  capital: '100000',
  rate: '0.13',
  term_days: 42 as const,
  issue_date: '2026-05-10',
  maturity_date: '2026-06-21',
  price: '0.984833',
  nominal_target: '101540',
  nominal_actual: '101540',
  investor_paid: '99999.41',
  investor_returned: '0.59',
  investor_yield: '1540.59',
  shortfall_pct: '0',
  selected_orders: [
    {
      id: 'o-1',
      installments_sum: '100',
      merchant_id: 'm-1',
      num_installments: 3,
      max_due_date: '2026-06-01',
    },
  ],
  total_eligible_merchants: 71,
  total_distinct_merchants: 1,
  installment_plazo_days: { min: 7, max: 42 },
  concentration_top: [],
  due_date_distribution: [],
  payload_hash: 'h',
};

describe('<NewCertWizard />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockListInvestors.mockResolvedValue({ data: [investor], total: 1, limit: 50, offset: 0 });
  });

  it('starts on Step 1 with the investor list', async () => {
    renderWithQuery(<NewCertWizard onClose={vi.fn()} />);
    await waitFor(() => expect(screen.getByText('Alpha')).toBeInTheDocument());
  });

  it('selecting an investor advances to Step 2', async () => {
    renderWithQuery(<NewCertWizard onClose={vi.fn()} />);
    await waitFor(() => expect(screen.getByText('Alpha')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Alpha'));
    await waitFor(() =>
      expect(screen.getByText(/llen[aá] los par[aá]metros/i)).toBeInTheDocument(),
    );
  });

  it('full flow: select investor → Recalcular → Emitir → Confirmar emisión closes modal', async () => {
    mockSimulate.mockResolvedValueOnce(mockSim);
    mockIssue.mockResolvedValueOnce({ id: 'c-1', code: 'C0001A' });
    const onClose = vi.fn();

    renderWithQuery(<NewCertWizard onClose={onClose} />);
    await waitFor(() => expect(screen.getByText('Alpha')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Alpha'));
    await waitFor(() =>
      expect(screen.getByText(/llen[aá] los par[aá]metros/i)).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole('button', { name: /recalcular/i }));
    await waitFor(() => expect(mockSimulate).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText(/las 3 reglas se cumplen/i)).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /emitir/i }));
    await waitFor(() => expect(screen.getByText(/irreversible/i)).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /confirmar emisi[oó]n/i }));
    await waitFor(() => expect(mockIssue).toHaveBeenCalled());
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('clicking the backdrop calls onClose', async () => {
    const onClose = vi.fn();
    const { container } = renderWithQuery(<NewCertWizard onClose={onClose} />);
    fireEvent.click(container.querySelector('[data-testid="cert-wizard-backdrop"]')!);
    expect(onClose).toHaveBeenCalled();
  });
});
