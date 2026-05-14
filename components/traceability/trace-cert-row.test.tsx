import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TraceCertRow } from './trace-cert-row';
import type { CertificateSummary } from '@/lib/types/certificate';

function cert(over: Partial<CertificateSummary> = {}): CertificateSummary {
  return {
    id: 'cert-1',
    certificate_code: 'C4572A',
    certificate_type: 'standard',
    status: 'issued',
    investor: { id: 'inv-1', legal_name: 'Inversora Alpha', rif: 'J-12345678-9' },
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
    issued_by: { id: 'u-1', email: 'maria@x.com', full_name: 'María Rodríguez' },
    created_at: '2026-04-27T14:30:00Z',
    ...over,
  };
}

describe('<TraceCertRow />', () => {
  it('renders code + capital + term @ rate + investor + emitted by + maturity + status pill', () => {
    render(<TraceCertRow cert={cert()} expanded={false} onToggle={vi.fn()} />);
    expect(screen.getByText('C4572A')).toBeInTheDocument();
    expect(screen.getByText(/\$100,000\.00.*42d.*13/)).toBeInTheDocument();
    expect(screen.getByText('Inversora Alpha')).toBeInTheDocument();
    expect(screen.getByText('J-12345678-9')).toBeInTheDocument();
    expect(screen.getByText('María Rodríguez')).toBeInTheDocument();
    expect(screen.getByText('08/06/2026')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('click fires onToggle with the cert id', () => {
    const onToggle = vi.fn();
    render(<TraceCertRow cert={cert()} expanded={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByText('C4572A'));
    expect(onToggle).toHaveBeenCalledWith('cert-1');
  });

  it('shows sweep pill for sweep certs', () => {
    render(
      <TraceCertRow
        cert={cert({ certificate_type: 'sweep' })}
        expanded={false}
        onToggle={vi.fn()}
      />,
    );
    expect(screen.getByText('Barrido Cashea')).toBeInTheDocument();
  });
});
