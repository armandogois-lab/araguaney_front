import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CertHeroStrip } from './cert-hero-strip';
import type { CertificateDetail } from '@/lib/types/certificate';

function mockCert(over: Partial<CertificateDetail> = {}): CertificateDetail {
  return {
    id: 'c-1',
    certificate_code: 'C4572A',
    certificate_type: 'standard',
    status: 'issued',
    investor: { id: 'inv-1', legal_name: 'Alpha', rif: 'J-1' },
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
    orders: [
      {
        id: 'o-1',
        external_order_id: '1',
        merchant: { id: 'm-1', current_name: 'Merch', rif: 'J-1' },
        purchase_date: '2026-04-20',
        max_due_date: '2026-05-31',
        installments_sum_snapshot: '100.0000',
        assigned_at: '2026-04-27T14:30:00Z',
        installments: [],
      },
      {
        id: 'o-2',
        external_order_id: '2',
        merchant: { id: 'm-2', current_name: 'Merch2', rif: 'J-2' },
        purchase_date: '2026-04-20',
        max_due_date: '2026-05-31',
        installments_sum_snapshot: '200.0000',
        assigned_at: '2026-04-27T14:30:00Z',
        installments: [],
      },
    ],
    events: [],
    ...over,
  };
}

describe('<CertHeroStrip />', () => {
  it('renders all 5 cards with formatted values', () => {
    render(<CertHeroStrip cert={mockCert()} />);
    expect(screen.getByText('CAPITAL')).toBeInTheDocument();
    expect(screen.getByText('$100,000.00')).toBeInTheDocument();
    expect(screen.getByText(/residual.*\$0\.59/)).toBeInTheDocument();
    expect(screen.getByText('TASA')).toBeInTheDocument();
    expect(screen.getByText('13.0%')).toBeInTheDocument();
    expect(screen.getByText(/\$1,540\.59.*vencimiento/)).toBeInTheDocument();
    expect(screen.getByText('PLAZO')).toBeInTheDocument();
    expect(screen.getByText('42d')).toBeInTheDocument();
    expect(screen.getByText(/vence 08\/06\/2026/i)).toBeInTheDocument();
    expect(screen.getByText('COMPOSICIÓN')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // orders.length
    expect(screen.getByText(/[oó]rdenes/i)).toBeInTheDocument();
    expect(screen.getByText('ESTADO')).toBeInTheDocument();
    expect(screen.getByText(/Activo/)).toBeInTheDocument();
  });

  it('shows cancelled sub-label when status is cancelled', () => {
    render(
      <CertHeroStrip
        cert={mockCert({
          status: 'cancelled',
          cancellation: {
            cancelled_at: '2026-05-01T10:00:00Z',
            cancelled_by: null,
            reason: 'test',
          },
        })}
      />,
    );
    expect(screen.getByText(/cancelado.*01\/05\/2026/i)).toBeInTheDocument();
  });

  it('renders PRIMER VTO card with the earliest order due date and its code', () => {
    render(
      <CertHeroStrip
        cert={mockCert({
          orders: [
            {
              id: 'o-1',
              external_order_id: '99999999',
              merchant: { id: 'm-1', current_name: 'A', rif: 'J-1' },
              purchase_date: '2026-04-01',
              max_due_date: '2026-05-15',
              installments_sum_snapshot: '100.00',
              assigned_at: '2026-04-27T14:30:00Z',
              installments: [],
            },
            {
              id: 'o-2',
              external_order_id: '85657474',
              merchant: { id: 'm-2', current_name: 'B', rif: 'J-2' },
              purchase_date: '2026-04-01',
              max_due_date: '2026-05-03',
              installments_sum_snapshot: '50.00',
              assigned_at: '2026-04-27T14:30:00Z',
              installments: [],
            },
          ],
        })}
      />,
    );
    expect(screen.getByText('PRIMER VTO')).toBeInTheDocument();
    expect(screen.getByText('03/05/2026')).toBeInTheDocument();
    expect(screen.getByText('orden #85657474')).toBeInTheDocument();
  });

  it('shows dash and "sin órdenes" when pool is empty', () => {
    render(<CertHeroStrip cert={mockCert({ orders: [] })} />);
    expect(screen.getByText('PRIMER VTO')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('sin órdenes')).toBeInTheDocument();
  });

  it('keeps the original 5 cards visible alongside PRIMER VTO', () => {
    render(<CertHeroStrip cert={mockCert()} />);
    expect(screen.getByText('CAPITAL')).toBeInTheDocument();
    expect(screen.getByText('TASA')).toBeInTheDocument();
    expect(screen.getByText('PLAZO')).toBeInTheDocument();
    expect(screen.getByText('COMPOSICIÓN')).toBeInTheDocument();
    expect(screen.getByText('ESTADO')).toBeInTheDocument();
    expect(screen.getByText('PRIMER VTO')).toBeInTheDocument();
  });
});
