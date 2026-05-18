import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { CycleMetricsStrip } from './cycle-metrics-strip';
import type { OrdersStats } from '@/lib/types/order';
import type { CertificatesListResponse, CertificateSummary } from '@/lib/types/certificate';

const { mockListCertificates } = vi.hoisted(() => ({ mockListCertificates: vi.fn() }));

vi.mock('@/lib/api/certificates', () => ({
  listCertificates: (...a: unknown[]) => mockListCertificates(...a),
}));

function statsQ(data?: OrdersStats, override: Partial<UseQueryResult<OrdersStats>> = {}) {
  return {
    data,
    isLoading: false,
    isError: false,
    ...override,
  } as UseQueryResult<OrdersStats>;
}
function certsQ(
  data?: CertificatesListResponse,
  override: Partial<UseQueryResult<CertificatesListResponse>> = {},
) {
  return {
    data,
    isLoading: false,
    isError: false,
    ...override,
  } as UseQueryResult<CertificatesListResponse>;
}

function makeCert(over: Partial<CertificateSummary> = {}): CertificateSummary {
  return {
    id: 'c-' + Math.random(),
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
    issue_date: '2026-04-22',
    maturity_date: '2026-06-03',
    cycle_week: '2026-W17',
    issued_by: { id: 'u-1', email: 'op@x.com', full_name: 'Op' },
    created_at: '2026-04-22T14:00:00Z',
    ...over,
  };
}

describe('<CycleMetricsStrip />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // default: no drafts
    mockListCertificates.mockResolvedValue({ data: [], total: 0, limit: 1, offset: 0 });
  });

  it('renders the 3 cards with computed values', async () => {
    const stats: OrdersStats = {
      by_status: {
        available: {
          count: 1500,
          total_amount: '1132418.0000',
          total_installments_amount: '1132418.0000',
        },
        assigned: { count: 0, total_amount: '0.0000', total_installments_amount: '0.0000' },
        matured: { count: 0, total_amount: '0.0000', total_installments_amount: '0.0000' },
        defaulted: { count: 0, total_amount: '0.0000', total_installments_amount: '0.0000' },
      },
      total_orders: 1500,
      available_capital: '1132418.0000',
    };
    const certs: CertificatesListResponse = {
      data: [
        makeCert({
          id: 'c-1',
          investor: { id: 'inv-1', legal_name: 'A', rif: 'J-1' },
          investor_capital: '300000',
        }),
        makeCert({
          id: 'c-2',
          investor: { id: 'inv-2', legal_name: 'B', rif: 'J-2' },
          investor_capital: '150000',
        }),
        makeCert({
          id: 'c-3',
          investor: { id: 'inv-1', legal_name: 'A', rif: 'J-1' },
          investor_capital: '85000',
        }),
      ],
      total: 3,
      limit: 50,
      offset: 0,
    };
    renderWithQuery(<CycleMetricsStrip statsQ={statsQ(stats)} certsQ={certsQ(certs)} />);
    expect(screen.getByText('Stock disponible')).toBeInTheDocument();
    expect(screen.getByText('$1,132,418.00')).toBeInTheDocument();
    expect(screen.getByText(/1,500 órdenes/)).toBeInTheDocument();
    expect(screen.getByText('Asignado esta semana')).toBeInTheDocument();
    expect(screen.getByText('$535,000.00')).toBeInTheDocument();
    expect(screen.getByText(/3 certificado/)).toBeInTheDocument();
    expect(screen.getByText('Inversores activos')).toBeInTheDocument();
    // Distinct investors: inv-1 + inv-2 = 2
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('stats card shows error when statsQ.isError', () => {
    renderWithQuery(
      <CycleMetricsStrip
        statsQ={statsQ(undefined, { isError: true })}
        certsQ={certsQ(undefined, { isLoading: true })}
      />,
    );
    expect(screen.getAllByText(/no se pudo cargar/i).length).toBeGreaterThanOrEqual(1);
  });

  it('shows skeleton text while loading', () => {
    renderWithQuery(
      <CycleMetricsStrip
        statsQ={statsQ(undefined, { isLoading: true })}
        certsQ={certsQ(undefined, { isLoading: true })}
      />,
    );
    expect(screen.getAllByText(/cargando/i).length).toBeGreaterThanOrEqual(1);
  });

  it('asignado = 0 when certs list is empty', () => {
    const stats: OrdersStats = {
      by_status: {
        available: { count: 0, total_amount: '0', total_installments_amount: '0' },
        assigned: { count: 0, total_amount: '0', total_installments_amount: '0' },
        matured: { count: 0, total_amount: '0', total_installments_amount: '0' },
        defaulted: { count: 0, total_amount: '0', total_installments_amount: '0' },
      },
      total_orders: 0,
      available_capital: '0',
    };
    const empty: CertificatesListResponse = { data: [], total: 0, limit: 50, offset: 0 };
    renderWithQuery(<CycleMetricsStrip statsQ={statsQ(stats)} certsQ={certsQ(empty)} />);
    expect(screen.getByText('$0.00')).toBeInTheDocument();
    expect(screen.getByText(/0 certificado/)).toBeInTheDocument();
  });

  it('renders "Borradores pendientes" pill with count from listCertificates', async () => {
    mockListCertificates.mockResolvedValue({ data: [], total: 5, limit: 1, offset: 0 });
    const empty: CertificatesListResponse = { data: [], total: 0, limit: 50, offset: 0 };
    const stats: OrdersStats = {
      by_status: {
        available: { count: 0, total_amount: '0', total_installments_amount: '0' },
        assigned: { count: 0, total_amount: '0', total_installments_amount: '0' },
        matured: { count: 0, total_amount: '0', total_installments_amount: '0' },
        defaulted: { count: 0, total_amount: '0', total_installments_amount: '0' },
      },
      total_orders: 0,
      available_capital: '0',
    };
    renderWithQuery(<CycleMetricsStrip statsQ={statsQ(stats)} certsQ={certsQ(empty)} />);
    expect(screen.getByText(/borradores pendientes/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('5')).toBeInTheDocument());
  });

  it('shows 0 when there are no pending drafts', async () => {
    mockListCertificates.mockResolvedValue({ data: [], total: 0, limit: 1, offset: 0 });
    const empty: CertificatesListResponse = { data: [], total: 0, limit: 50, offset: 0 };
    const stats: OrdersStats = {
      by_status: {
        available: { count: 0, total_amount: '0', total_installments_amount: '0' },
        assigned: { count: 0, total_amount: '0', total_installments_amount: '0' },
        matured: { count: 0, total_amount: '0', total_installments_amount: '0' },
        defaulted: { count: 0, total_amount: '0', total_installments_amount: '0' },
      },
      total_orders: 0,
      available_capital: '0',
    };
    renderWithQuery(<CycleMetricsStrip statsQ={statsQ(stats)} certsQ={certsQ(empty)} />);
    expect(screen.getByText(/borradores pendientes/i)).toBeInTheDocument();
    // "0" appears once from Inversores activos too, so check the pill specifically
    await waitFor(() => {
      const link = screen.getByRole('link', { name: /borradores pendientes/i });
      expect(link).toHaveTextContent('0');
    });
  });
});
