import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CertOrdersTable } from './cert-orders-table';
import type { CertificateOrder } from '@/lib/types/certificate';

const orders: CertificateOrder[] = [
  {
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
      { installment_number: 3, amount: '29.08', due_date: '2026-04-17', status: 'pending' },
    ],
  },
  {
    id: 'o-2',
    external_order_id: '85656105',
    merchant: { id: 'm-2', current_name: 'GRUPO CANALETTO', rif: 'J-2' },
    purchase_date: '2026-03-18',
    max_due_date: '2026-04-03',
    installments_sum_snapshot: '26.0700',
    assigned_at: '2026-04-27T14:30:00Z',
    installments: [
      { installment_number: 1, amount: '26.07', due_date: '2026-04-03', status: 'pending' },
    ],
  },
];

describe('<CertOrdersTable />', () => {
  it('renders all orders with formatted values + total footer', () => {
    const { container } = render(<CertOrdersTable orders={orders} />);
    expect(screen.getByText('85657474')).toBeInTheDocument();
    expect(screen.getByText('CENTRAL MADEIRENSE')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // cuotas count
    expect(screen.getByText('$87.24')).toBeInTheDocument();
    expect(screen.getByText('85656105')).toBeInTheDocument();
    expect(screen.getByText('GRUPO CANALETTO')).toBeInTheDocument();
    // Check the footer contains all the parts
    const footer = container.querySelector('.bg-subtle.border-border-subtle.border-t');
    expect(footer?.textContent).toMatch(/Total del pool/i);
    expect(footer?.textContent).toMatch(/\$113\.31/);
    expect(footer?.textContent).toMatch(/2.*órdenes/);
    expect(footer?.textContent).toMatch(/4.*cuotas/);
  });

  it('shows empty state for empty pool', () => {
    render(<CertOrdersTable orders={[]} />);
    expect(screen.getByText(/sin [oó]rdenes/i)).toBeInTheDocument();
  });

  it('filters by substring on order code or merchant', () => {
    render(<CertOrdersTable orders={orders} />);
    fireEvent.change(screen.getByPlaceholderText(/id o comercio/i), {
      target: { value: 'canaletto' },
    });
    expect(screen.getByText('GRUPO CANALETTO')).toBeInTheDocument();
    expect(screen.queryByText('CENTRAL MADEIRENSE')).not.toBeInTheDocument();
  });

  it('paginates 100 orders to 2 pages of 50', () => {
    const many: CertificateOrder[] = Array.from({ length: 100 }, (_, i) => ({
      id: `o-${i}`,
      external_order_id: String(10_000_000 + i),
      merchant: { id: `m-${i}`, current_name: `Comercio ${i}`, rif: `J-${i}` },
      purchase_date: '2026-03-18',
      max_due_date: '2026-04-03',
      installments_sum_snapshot: '50.0000',
      assigned_at: '2026-04-27T14:30:00Z',
      installments: [
        { installment_number: 1, amount: '50.00', due_date: '2026-04-03', status: 'pending' },
      ],
    }));
    render(<CertOrdersTable orders={many} />);
    expect(screen.getByText(/mostrando 1[–-]50 de 100/i)).toBeInTheDocument();
    // first page shows orders 0..49
    expect(screen.getByText('10000000')).toBeInTheDocument();
    expect(screen.queryByText('10000050')).not.toBeInTheDocument();
  });

  it('prev/next buttons navigate pages', () => {
    const many: CertificateOrder[] = Array.from({ length: 60 }, (_, i) => ({
      id: `o-${i}`,
      external_order_id: String(20_000_000 + i),
      merchant: { id: `m-${i}`, current_name: `C ${i}`, rif: `J-${i}` },
      purchase_date: '2026-03-18',
      max_due_date: '2026-04-03',
      installments_sum_snapshot: '10.0000',
      assigned_at: '2026-04-27T14:30:00Z',
      installments: [],
    }));
    render(<CertOrdersTable orders={many} />);
    expect(screen.getByLabelText(/p[aá]gina anterior/i)).toBeDisabled();
    fireEvent.click(screen.getByLabelText(/p[aá]gina siguiente/i));
    expect(screen.getByText(/mostrando 51[–-]60 de 60/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/p[aá]gina siguiente/i)).toBeDisabled();
    expect(screen.getByText('20000050')).toBeInTheDocument();
  });

  it('pool total is calculated over the filtered set (not just current page)', () => {
    const many: CertificateOrder[] = Array.from({ length: 60 }, (_, i) => ({
      id: `o-${i}`,
      external_order_id: String(30_000_000 + i),
      merchant: { id: `m-${i}`, current_name: `C ${i}`, rif: `J-${i}` },
      purchase_date: '2026-03-18',
      max_due_date: '2026-04-03',
      installments_sum_snapshot: '100.0000',
      assigned_at: '2026-04-27T14:30:00Z',
      installments: [
        { installment_number: 1, amount: '100.00', due_date: '2026-04-03', status: 'pending' },
      ],
    }));
    render(<CertOrdersTable orders={many} />);
    // Page 1 shows 50 rows but total reflects 60 orders × $100 = $6,000
    expect(
      screen.getByText(/total del pool.*\$6,000\.00.*60 [oó]rdenes.*60 cuotas/i),
    ).toBeInTheDocument();
  });

  it('changing the filter resets page to 0', () => {
    const many: CertificateOrder[] = Array.from({ length: 60 }, (_, i) => ({
      id: `o-${i}`,
      external_order_id: String(40_000_000 + i),
      merchant: { id: `m-${i}`, current_name: i < 5 ? 'CANALETTO' : `Otro ${i}`, rif: `J-${i}` },
      purchase_date: '2026-03-18',
      max_due_date: '2026-04-03',
      installments_sum_snapshot: '10.0000',
      assigned_at: '2026-04-27T14:30:00Z',
      installments: [],
    }));
    render(<CertOrdersTable orders={many} />);
    fireEvent.click(screen.getByLabelText(/p[aá]gina siguiente/i));
    expect(screen.getByText(/mostrando 51[–-]60 de 60/i)).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/id o comercio/i), {
      target: { value: 'canaletto' },
    });
    // 5 matches, all visible on page 0
    expect(screen.getByText(/mostrando 1[–-]5 de 5/i)).toBeInTheDocument();
  });
});
