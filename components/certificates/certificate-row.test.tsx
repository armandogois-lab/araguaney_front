import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CertificateRow } from './certificate-row';
import type { CertificateSummary } from '@/lib/types/certificate';

const { mockPush } = vi.hoisted(() => ({ mockPush: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

function mockCert(over: Partial<CertificateSummary> = {}): CertificateSummary {
  return {
    id: 'c-1',
    certificate_code: 'C4572A',
    certificate_type: 'standard',
    status: 'issued',
    investor: { id: 'inv-1', legal_name: 'Inversora Alpha, C.A.', rif: 'J-12345678-9' },
    investor_capital: '100000.0000',
    annual_rate: '0.130000',
    term_days: 42,
    price: '0.984833',
    nominal_target: '101540.6000',
    nominal_actual: '101540.0000',
    investor_paid: '99999.4100',
    investor_yield: '1540.5900',
    shortfall_pct: '0.000006',
    issue_date: '2026-04-27',
    maturity_date: '2026-06-08',
    cycle_week: '2026-W18',
    issued_by: { id: 'u-1', email: 'op@x.com', full_name: 'María Rodríguez' },
    created_at: '2026-04-27T14:30:00Z',
    ...over,
  };
}

describe('<CertificateRow />', () => {
  function wrap(row: React.ReactElement) {
    return render(
      <table>
        <tbody>{row}</tbody>
      </table>,
    );
  }

  it('renders all columns with formatted values', () => {
    wrap(<CertificateRow cert={mockCert()} />);
    expect(screen.getByText('C4572A')).toBeInTheDocument();
    expect(screen.getByText('Inversora Alpha, C.A.')).toBeInTheDocument();
    expect(screen.getByText('27/04/2026')).toBeInTheDocument();
    expect(screen.getByText('08/06/2026')).toBeInTheDocument();
    expect(screen.getByText('$100,000.00')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('navigates to /certificates/{id} on click', () => {
    mockPush.mockClear();
    wrap(<CertificateRow cert={mockCert()} />);
    fireEvent.click(screen.getByText('C4572A'));
    expect(mockPush).toHaveBeenCalledWith('/certificates/c-1');
  });

  it('renders cancelled status correctly', () => {
    wrap(<CertificateRow cert={mockCert({ status: 'cancelled' })} />);
    expect(screen.getByText('Cancelado')).toBeInTheDocument();
  });
});
