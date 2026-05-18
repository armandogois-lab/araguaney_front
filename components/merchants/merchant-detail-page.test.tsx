import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MerchantDetailPage } from './merchant-detail-page';
import type { MerchantDetail } from '@/lib/types/merchant';

const M: MerchantDetail = {
  id: 'm-1',
  rif: 'J-1',
  current_name: 'CENTRAL MADEIRENSE',
  first_seen_at: '2026-01-15T00:00:00Z',
  last_seen_at: '2026-05-10T12:00:00Z',
  order_count: 42,
  total_orders_amount: '12345.6789',
  name_history: [
    {
      id: 'h-2',
      name: 'CENTRAL MADEIRENSE',
      effective_from: '2026-03-01',
      effective_to: null,
    },
    {
      id: 'h-1',
      name: 'C. MADEIRENSE',
      effective_from: '2026-01-15',
      effective_to: '2026-02-28',
    },
  ],
  orders_summary: {
    total_count: 42,
    total_amount: '12345.6789',
    by_status: { available: 10, assigned: 20, matured: 8, defaulted: 4 },
  },
};

describe('<MerchantDetailPage />', () => {
  it('renders all sections with merchant data', () => {
    render(<MerchantDetailPage merchant={M} />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'CENTRAL MADEIRENSE' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Órdenes totales')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('$12,345.68')).toBeInTheDocument();
    expect(screen.getByText('Órdenes por status')).toBeInTheDocument();
    expect(screen.getByText('Disponibles')).toBeInTheDocument();
    expect(screen.getByText('Historial de nombres')).toBeInTheDocument();
    expect(screen.getByText('Actual')).toBeInTheDocument();
  });
});
