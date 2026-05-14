import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { TraceKpiStrip } from './trace-kpi-strip';
import type { CertificateSummary, CertificatesListResponse } from '@/lib/types/certificate';

function cert(over: Partial<CertificateSummary> = {}): CertificateSummary {
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
    issue_date: '2026-04-27',
    maturity_date: '2026-06-08',
    cycle_week: '2026-W17',
    issued_by: { id: 'u-1', email: 'maria@x.com', full_name: 'María R.' },
    created_at: '2026-04-27T14:30:00Z',
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

describe('<TraceKpiStrip />', () => {
  it('renders 3 cards with computed values', () => {
    const data: CertificatesListResponse = {
      data: [
        cert({
          investor: { id: 'inv-1', legal_name: 'A', rif: 'J-1' },
          issued_by: { id: 'u-1', email: 'm@x', full_name: 'María R.' },
        }),
        cert({
          investor: { id: 'inv-2', legal_name: 'B', rif: 'J-2' },
          issued_by: { id: 'u-2', email: 'p@x', full_name: 'Pedro S.' },
        }),
        cert({
          investor: { id: 'inv-1', legal_name: 'A', rif: 'J-1' },
          issued_by: { id: 'u-1', email: 'm@x', full_name: 'María R.' },
        }),
      ],
      total: 12,
      limit: 100,
      offset: 0,
    };
    render(<TraceKpiStrip certsQ={q(data)} />);
    expect(screen.getByText('Certificados emitidos')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Inversores con cobertura')).toBeInTheDocument();
    // 2 distinct investors in the sample
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Usuarios emisores')).toBeInTheDocument();
    expect(screen.getByText(/María R\. · Pedro S\./)).toBeInTheDocument();
  });

  it('all zero when list is empty', () => {
    const empty: CertificatesListResponse = { data: [], total: 0, limit: 100, offset: 0 };
    render(<TraceKpiStrip certsQ={q(empty)} />);
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(3);
  });

  it('shows loading skeleton when isLoading', () => {
    render(<TraceKpiStrip certsQ={q(undefined, { isLoading: true })} />);
    expect(screen.getAllByText(/cargando/i).length).toBeGreaterThanOrEqual(1);
  });
});
