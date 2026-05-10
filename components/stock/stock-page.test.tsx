import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { StockPage } from './stock-page';

const { mockListOrders, mockGetStats, mockCountCerts, mockListMerchants } = vi.hoisted(() => ({
  mockListOrders: vi.fn(),
  mockGetStats: vi.fn(),
  mockCountCerts: vi.fn(),
  mockListMerchants: vi.fn(),
}));

vi.mock('@/lib/api/orders', () => ({
  listOrders: (...a: unknown[]) => mockListOrders(...a),
  getOrdersStats: () => mockGetStats(),
}));

vi.mock('@/lib/api/certificates', () => ({
  countCertificatesIssued: (from: string, to: string) => mockCountCerts(from, to),
}));

vi.mock('@/lib/api/merchants', () => ({
  listMerchants: (...a: unknown[]) => mockListMerchants(...a),
}));

describe('<StockPage />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetStats.mockResolvedValue({
      by_status: {
        available: { count: 100, total_amount: '0', total_installments_amount: '5000' },
        assigned: { count: 0, total_amount: '0', total_installments_amount: '0' },
        matured: { count: 0, total_amount: '0', total_installments_amount: '0' },
        defaulted: { count: 0, total_amount: '0', total_installments_amount: '0' },
      },
      total_orders: 100,
      available_capital: '5000',
    });
    mockCountCerts.mockResolvedValue({ total: 0 });
    mockListMerchants.mockResolvedValue({ data: [], total: 0, limit: 200, offset: 0 });
    mockListOrders.mockResolvedValue({ data: [], total: 0, limit: 50, offset: 0 });
  });

  it('renders header, banner, filters and table', async () => {
    renderWithQuery(<StockPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: /stock de [oó]rdenes/i }),
    ).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('100')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Disponibles' })).toHaveAttribute(
      'data-active',
      'true',
    );
  });

  it('re-keys the orders query when status filter changes', async () => {
    renderWithQuery(<StockPage />);
    await waitFor(() => expect(mockListOrders).toHaveBeenCalledTimes(1));
    expect(mockListOrders.mock.calls[0][0].status).toBe('available');

    fireEvent.click(screen.getByRole('button', { name: 'Todas' }));
    await waitFor(() => expect(mockListOrders).toHaveBeenCalledTimes(2));
    expect(mockListOrders.mock.calls[1][0].status).toBeUndefined();
  });
});
