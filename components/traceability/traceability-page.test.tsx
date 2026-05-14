import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { TraceabilityPage } from './traceability-page';
import type { CertificateDetail, CertificateSummary } from '@/lib/types/certificate';

const { mockList, mockDetail } = vi.hoisted(() => ({
  mockList: vi.fn(),
  mockDetail: vi.fn(),
}));

vi.mock('@/lib/api/certificates', () => ({
  listCertificates: (...a: unknown[]) => mockList(...a),
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
    investor_returned: '0.65',
    payload_hash: 'abcdef1234567890fedcba',
    cancellation: null,
    orders: [
      {
        id: 'o-1',
        external_order_id: '85657474',
        merchant: { id: 'm-1', current_name: 'CENTRAL MADEIRENSE', rif: 'J-1' },
        purchase_date: '2026-03-18',
        max_due_date: '2026-04-03',
        installments_sum_snapshot: '87.24',
        assigned_at: '2026-04-27T14:30:00Z',
        installments: [
          { installment_number: 1, amount: '29.08', due_date: '2026-04-03', status: 'pending' },
        ],
      },
    ],
    events: [],
  };
}

describe('<TraceabilityPage />', () => {
  beforeEach(() => vi.clearAllMocks());

  it('smoke: header + KPIs + toolbar + cert list', async () => {
    mockList.mockResolvedValue({ data: [cert()], total: 1, limit: 100, offset: 0 });
    renderWithQuery(<TraceabilityPage />);
    expect(screen.getByRole('heading', { level: 1, name: /trazabilidad/i })).toBeInTheDocument();
    await waitFor(() => expect(mockList).toHaveBeenCalled());
    const arg = mockList.mock.calls[0][0];
    expect(arg.issue_date_from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(arg.issue_date_to).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(arg.sort).toBe('issue_date_desc');
    expect(arg.limit).toBe(100);
  });

  it('expanding a cert triggers getCertificateDetail', async () => {
    mockList.mockResolvedValue({ data: [cert()], total: 1, limit: 100, offset: 0 });
    mockDetail.mockResolvedValueOnce(detail());
    renderWithQuery(<TraceabilityPage />);
    await waitFor(() => expect(screen.getByText('C4572A')).toBeInTheDocument());
    fireEvent.click(screen.getByText('C4572A'));
    await waitFor(() => expect(mockDetail).toHaveBeenCalledWith('cert-1'));
  });

  it('clicking an order opens the inspector', async () => {
    mockList.mockResolvedValue({ data: [cert()], total: 1, limit: 100, offset: 0 });
    mockDetail.mockResolvedValueOnce(detail());
    renderWithQuery(<TraceabilityPage />);
    await waitFor(() => expect(screen.getByText('C4572A')).toBeInTheDocument());
    fireEvent.click(screen.getByText('C4572A'));
    await waitFor(() => expect(screen.getByText('85657474')).toBeInTheDocument());
    fireEvent.click(screen.getByText('85657474'));
    expect(screen.getByText('ORDEN')).toBeInTheDocument();
    expect(screen.getByText(/Cadena de auditoría/i)).toBeInTheDocument();
  });
});
