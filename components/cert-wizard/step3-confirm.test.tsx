import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { Step3Confirm } from './step3-confirm';

const { mockIssue, toastSuccess, toastError } = vi.hoisted(() => ({
  mockIssue: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock('@/lib/api/certificates', () => ({
  issueCertificate: (...a: unknown[]) => mockIssue(...a),
}));

vi.mock('sonner', () => ({
  toast: {
    success: (...a: unknown[]) => toastSuccess(...a),
    error: (...a: unknown[]) => toastError(...a),
  },
}));

const investor = { id: 'inv-1', legal_name: 'Alpha', rif: 'J-1' };
const sim = {
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
  shortfall_pct: '0',
  selected_orders: [
    {
      id: 'o-1',
      installments_sum: '0',
      merchant_id: 'm-1',
      num_installments: 3,
      max_due_date: '2026-06-01',
    },
    {
      id: 'o-2',
      installments_sum: '0',
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
  payload_hash: 'hash-abc',
};

describe('<Step3Confirm />', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders investor + terms summary', () => {
    renderWithQuery(
      <Step3Confirm
        simulation={sim}
        triggerConfirm={false}
        onPoolChanged={vi.fn()}
        onSuccess={vi.fn()}
        onConfirmStart={vi.fn()}
        onConfirmEnd={vi.fn()}
      />,
    );
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('J-1')).toBeInTheDocument();
    expect(screen.getByText('$100,000.00')).toBeInTheDocument();
    expect(screen.getByText('42 días')).toBeInTheDocument();
  });

  it('triggerConfirm=true posts /certificates with order_ids and payload_hash', async () => {
    mockIssue.mockResolvedValueOnce({
      id: 'c-1',
      certificate_code: 'C0001A',
    } as unknown as import('@/lib/types/certificate').Certificate);
    const onSuccess = vi.fn();
    renderWithQuery(
      <Step3Confirm
        simulation={sim}
        triggerConfirm={true}
        onPoolChanged={vi.fn()}
        onSuccess={onSuccess}
        onConfirmStart={vi.fn()}
        onConfirmEnd={vi.fn()}
      />,
    );
    await waitFor(() => expect(mockIssue).toHaveBeenCalled());
    expect(mockIssue.mock.calls[0][0]).toMatchObject({
      investor_id: 'inv-1',
      order_ids: ['o-1', 'o-2'],
      expected_payload_hash: 'hash-abc',
    });
    await waitFor(() =>
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'c-1', certificate_code: 'C0001A' }),
      ),
    );
    expect(toastSuccess).toHaveBeenCalledWith(expect.stringContaining('C0001A'));
  });

  it('on 409 calls onPoolChanged + does NOT call onSuccess', async () => {
    const err = new Error('payload_hash mismatch') as Error & { status?: number };
    err.status = 409;
    mockIssue.mockRejectedValueOnce(err);
    const onPoolChanged = vi.fn();
    const onSuccess = vi.fn();
    renderWithQuery(
      <Step3Confirm
        simulation={sim}
        triggerConfirm={true}
        onPoolChanged={onPoolChanged}
        onSuccess={onSuccess}
        onConfirmStart={vi.fn()}
        onConfirmEnd={vi.fn()}
      />,
    );
    await waitFor(() => expect(onPoolChanged).toHaveBeenCalledTimes(1));
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
