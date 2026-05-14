import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { TraceCertCard } from './trace-cert-card';
import type { CertificateSummary } from '@/lib/types/certificate';

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

describe('<TraceCertCard />', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders cert row only when collapsed', () => {
    renderWithQuery(
      <TraceCertCard cert={cert()} expanded={false} onToggle={vi.fn()} onSelectOrder={vi.fn()} />,
    );
    expect(screen.getByText('C4572A')).toBeInTheDocument();
    expect(mockDetail).not.toHaveBeenCalled();
  });

  it('row click fires onToggle with cert id', () => {
    const onToggle = vi.fn();
    renderWithQuery(
      <TraceCertCard cert={cert()} expanded={false} onToggle={onToggle} onSelectOrder={vi.fn()} />,
    );
    fireEvent.click(screen.getByText('C4572A'));
    expect(onToggle).toHaveBeenCalledWith('cert-1');
  });
});
