import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { TraceCertOrders } from './trace-cert-orders';
import type { CertificateSummary, CertificateDetail } from '@/lib/types/certificate';

const { mockDetail } = vi.hoisted(() => ({ mockDetail: vi.fn() }));

vi.mock('@/lib/api/certificates', () => ({
  getCertificateDetail: (...a: unknown[]) => mockDetail(...a),
}));

function cert(over: Partial<CertificateSummary> = {}): CertificateSummary {
  return {
    id: 'cert-1',
    certificate_code: 'C4572A',
    certificate_type: 'standard',
    status: 'issued',
    investor: { id: 'inv-1', legal_name: 'Alpha', rif: 'J-1' },
    investor_capital: '100000.0000',
    annual_rate: '0.130000',
    term_days: 42,
    price: '0.985060',
    nominal_target: '101516.6589',
    nominal_actual: '101516.0000',
    investor_paid: '99999.3510',
    investor_yield: '1516.6490',
    shortfall_pct: '0.000006',
    issue_date: '2026-04-27',
    maturity_date: '2026-06-08',
    cycle_week: '2026-W17',
    issued_by: { id: 'u-1', email: 'op@x.com', full_name: 'Op' },
    created_at: '2026-04-27T14:30:00Z',
    ...over,
  };
}

function detail(): CertificateDetail {
  return {
    ...cert(),
    investor_returned: '0.6490',
    payload_hash: 'sha-abc',
    cancellation: null,
    orders: [
      {
        id: 'o-1',
        external_order_id: '85657474',
        merchant: { id: 'm-1', current_name: 'CENTRAL MADEIRENSE', rif: 'J-1' },
        purchase_date: '2026-03-18',
        max_due_date: '2026-04-03',
        installments_sum_snapshot: '87.2400',
        assigned_at: '2026-04-27T14:30:00Z',
        installments: [
          { installment_number: 1, amount: '29.08', due_date: '2026-04-03', status: 'pending' },
          { installment_number: 2, amount: '29.08', due_date: '2026-04-10', status: 'pending' },
          { installment_number: 3, amount: '29.08', due_date: '2026-04-17', status: 'pending' },
        ],
      },
    ],
    events: [],
  };
}

describe('<TraceCertOrders />', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders nothing when enabled=false', () => {
    const { container } = renderWithQuery(
      <TraceCertOrders cert={cert()} enabled={false} onSelectOrder={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
    expect(mockDetail).not.toHaveBeenCalled();
  });

  it('shows skeleton while loading', () => {
    mockDetail.mockImplementation(() => new Promise(() => {}));
    renderWithQuery(<TraceCertOrders cert={cert()} enabled={true} onSelectOrder={vi.fn()} />);
    expect(screen.getByText(/cargando [oó]rdenes/i)).toBeInTheDocument();
  });

  it('renders order rows after fetch', async () => {
    mockDetail.mockResolvedValueOnce(detail());
    renderWithQuery(<TraceCertOrders cert={cert()} enabled={true} onSelectOrder={vi.fn()} />);
    await waitFor(() => expect(screen.getByText('85657474')).toBeInTheDocument());
    expect(screen.getByText('CENTRAL MADEIRENSE')).toBeInTheDocument();
    expect(screen.getByText('3c')).toBeInTheDocument();
    expect(screen.getByText('$87.24')).toBeInTheDocument();
  });

  it('click order row fires onSelectOrder', async () => {
    mockDetail.mockResolvedValueOnce(detail());
    const onSelectOrder = vi.fn();
    renderWithQuery(<TraceCertOrders cert={cert()} enabled={true} onSelectOrder={onSelectOrder} />);
    await waitFor(() => expect(screen.getByText('85657474')).toBeInTheDocument());
    fireEvent.click(screen.getByText('85657474'));
    expect(onSelectOrder).toHaveBeenCalledTimes(1);
    const [orderArg, certArg] = onSelectOrder.mock.calls[0];
    expect(orderArg.external_order_id).toBe('85657474');
    expect(certArg.id).toBe('cert-1');
  });
});
