import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { CycleCertificatesPanel } from './cycle-certificates-panel';
import type { CertificatesListResponse, CertificateSummary } from '@/lib/types/certificate';

const { mockPush } = vi.hoisted(() => ({ mockPush: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

function cert(over: Partial<CertificateSummary> = {}): CertificateSummary {
  return {
    id: 'c-1',
    certificate_code: 'C4572A',
    certificate_type: 'standard',
    status: 'issued',
    investor: { id: 'inv-1', legal_name: 'Inversora Alpha', rif: 'J-1' },
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

function q(
  data?: CertificatesListResponse,
  over: Partial<UseQueryResult<CertificatesListResponse>> = {},
) {
  return {
    data,
    isLoading: false,
    isError: false,
    ...over,
  } as UseQueryResult<CertificatesListResponse>;
}

describe('<CycleCertificatesPanel />', () => {
  it('renders rows for each cert with formatted values', () => {
    const data: CertificatesListResponse = {
      data: [
        cert({ id: 'c-1', certificate_code: 'C4572A' }),
        cert({ id: 'c-2', certificate_code: 'C4572B', certificate_type: 'sweep' }),
      ],
      total: 2,
      limit: 50,
      offset: 0,
    };
    render(<CycleCertificatesPanel certsQ={q(data)} />);
    expect(screen.getByText('C4572A')).toBeInTheDocument();
    expect(screen.getByText('C4572B')).toBeInTheDocument();
    expect(screen.getByText('Barrido Cashea')).toBeInTheDocument();
  });

  it('row click navigates to /certificates/{id}', () => {
    mockPush.mockClear();
    const data: CertificatesListResponse = {
      data: [cert({ id: 'c-1', certificate_code: 'C4572A' })],
      total: 1,
      limit: 50,
      offset: 0,
    };
    render(<CycleCertificatesPanel certsQ={q(data)} />);
    fireEvent.click(screen.getByText('C4572A'));
    expect(mockPush).toHaveBeenCalledWith('/certificates/c-1');
  });

  it('shows empty state when no certs this week', () => {
    const empty: CertificatesListResponse = { data: [], total: 0, limit: 50, offset: 0 };
    render(<CycleCertificatesPanel certsQ={q(empty)} />);
    expect(screen.getByText(/sin certificados emitidos esta semana/i)).toBeInTheDocument();
  });

  it('shows error state when query fails', () => {
    render(<CycleCertificatesPanel certsQ={q(undefined, { isError: true })} />);
    expect(screen.getByText(/no se pudo cargar/i)).toBeInTheDocument();
  });
});
