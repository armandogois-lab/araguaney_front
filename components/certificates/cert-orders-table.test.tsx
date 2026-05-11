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
});
