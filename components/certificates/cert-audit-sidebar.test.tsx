import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CertAuditSidebar } from './cert-audit-sidebar';
import type { CertificateDetail } from '@/lib/types/certificate';

function mockCert(over: Partial<CertificateDetail> = {}): CertificateDetail {
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
    investor_returned: '0.5900',
    investor_yield: '1540.5900',
    shortfall_pct: '0.000006',
    issue_date: '2026-04-27',
    maturity_date: '2026-06-08',
    cycle_week: '2026-W18',
    issued_by: { id: 'u-1', email: 'op@x.com', full_name: 'María R.' },
    created_at: '2026-04-27T14:30:00Z',
    payload_hash: 'h',
    cancellation: null,
    orders: [],
    events: [
      {
        id: 'e-1',
        event_type: 'issued',
        occurred_at: '2026-04-27T14:30:00Z',
        payload: {},
        actor_id: 'u-1',
      },
      {
        id: 'e-2',
        event_type: 'simulated',
        occurred_at: '2026-04-27T14:00:00Z',
        payload: {},
        actor_id: 'u-1',
      },
    ],
    ...over,
  };
}

describe('<CertAuditSidebar />', () => {
  it('renders investor info block', () => {
    render(<CertAuditSidebar cert={mockCert()} />);
    expect(screen.getByText('INVERSOR')).toBeInTheDocument();
    expect(screen.getByText('Inversora Alpha, C.A.')).toBeInTheDocument();
    expect(screen.getByText('J-12345678-9')).toBeInTheDocument();
  });

  it('renders 3 verified rules with ✓', () => {
    render(<CertAuditSidebar cert={mockCert()} />);
    expect(screen.getByText(/reglas/i)).toBeInTheDocument();
    expect(screen.getByText(/Vencimientos ≤ certificado/i)).toBeInTheDocument();
    expect(screen.getByText(/[oó]rdenes indivisibles/i)).toBeInTheDocument();
    expect(screen.getByText(/redondeo hacia abajo/i)).toBeInTheDocument();
  });

  it('renders audit events with formatted timestamps', () => {
    render(<CertAuditSidebar cert={mockCert()} />);
    expect(screen.getByText(/issued/)).toBeInTheDocument();
    expect(screen.getByText(/simulated/)).toBeInTheDocument();
  });

  it('shows empty state for events when none', () => {
    render(<CertAuditSidebar cert={mockCert({ events: [] })} />);
    expect(screen.getByText(/sin eventos/i)).toBeInTheDocument();
  });
});
