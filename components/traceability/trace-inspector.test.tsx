import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TraceInspector } from './trace-inspector';
import type { CertificateOrder, CertificateSummary } from '@/lib/types/certificate';

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

function order(): CertificateOrder {
  return {
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
    ],
  };
}

describe('<TraceInspector />', () => {
  it('renders 4 chain steps', () => {
    render(
      <TraceInspector
        order={order()}
        cert={cert()}
        payloadHash="abcdef1234567890abcdef"
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText('ORDEN')).toBeInTheDocument();
    expect(screen.getByText('CERTIFICADO')).toBeInTheDocument();
    expect(screen.getByText('INVERSOR')).toBeInTheDocument();
    expect(screen.getByText('EMITIDO POR')).toBeInTheDocument();
    expect(screen.getByText('CENTRAL MADEIRENSE')).toBeInTheDocument();
    expect(screen.getByText('C4572A')).toBeInTheDocument();
    expect(screen.getByText('Inversora Alpha')).toBeInTheDocument();
    expect(screen.getByText('María Rodríguez')).toBeInTheDocument();
  });

  it('renders truncated hash', () => {
    render(
      <TraceInspector
        order={order()}
        cert={cert()}
        payloadHash="abcdef1234567890fedcba"
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText(/HASH/)).toBeInTheDocument();
    expect(screen.getByText(/abcdef12.*dcba/)).toBeInTheDocument();
  });

  it('renders "HASH · —" when payloadHash is null', () => {
    render(<TraceInspector order={order()} cert={cert()} payloadHash={null} onClose={vi.fn()} />);
    expect(screen.getByText(/HASH · —/)).toBeInTheDocument();
  });

  it('click × fires onClose', () => {
    const onClose = vi.fn();
    render(<TraceInspector order={order()} cert={cert()} payloadHash="abc" onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /^×$/ }));
    expect(onClose).toHaveBeenCalled();
  });
});
