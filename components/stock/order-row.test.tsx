import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { OrderRow } from './order-row';
import type { OrderSummary } from '@/lib/types/order';

function mockOrder(overrides: Partial<OrderSummary> = {}): OrderSummary {
  return {
    id: 'o-1',
    external_order_id: '85657474',
    status: 'available',
    purchase_date: '2026-03-18',
    max_due_date: '2026-04-03',
    total_amount: '87.2400',
    installments_sum: '87.2400',
    num_installments: 3,
    imported_at: '2026-05-08T18:15:00Z',
    merchant: { id: 'm-1', current_name: 'CENTRAL MADEIRENSE, C.A', rif: 'J-12345678-9' },
    end_user: { id: 'eu-1', external_hash: 'h', national_id: null, full_name: null },
    batch: { id: 'b-1', external_code: 'B-1' },
    ...overrides,
  };
}

describe('<OrderRow />', () => {
  function wrap(row: React.ReactElement) {
    return render(
      <table>
        <tbody>{row}</tbody>
      </table>,
    );
  }

  it('renders all columns with formatted values', () => {
    const { getByText } = wrap(<OrderRow order={mockOrder()} />);
    expect(getByText('85657474')).toBeInTheDocument();
    expect(getByText('18/03/2026')).toBeInTheDocument();
    expect(getByText('CENTRAL MADEIRENSE, C.A')).toBeInTheDocument();
    expect(getByText('3')).toBeInTheDocument();
    expect(getByText('$87.24')).toBeInTheDocument();
    expect(getByText('Disponible')).toBeInTheDocument();
  });

  it('formats integer amounts with no decimals only when an integer', () => {
    const { getByText } = wrap(<OrderRow order={mockOrder({ installments_sum: '300.0000' })} />);
    expect(getByText('$300')).toBeInTheDocument();
  });

  it('passes the right status to OrderStatusPill', () => {
    const { getByText } = wrap(<OrderRow order={mockOrder({ status: 'matured' })} />);
    expect(getByText('Vencida')).toBeInTheDocument();
  });
});
