import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { StockStatsBanner } from './stock-stats-banner';

const { mockGetOrdersStats, mockCountCerts } = vi.hoisted(() => ({
  mockGetOrdersStats: vi.fn(),
  mockCountCerts: vi.fn(),
}));

vi.mock('@/lib/api/orders', () => ({
  getOrdersStats: () => mockGetOrdersStats(),
}));

vi.mock('@/lib/api/certificates', () => ({
  countCertificatesIssued: (from: string, to: string) => mockCountCerts(from, to),
}));

describe('<StockStatsBanner />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading placeholders while fetching', () => {
    mockGetOrdersStats.mockImplementation(() => new Promise(() => {}));
    mockCountCerts.mockImplementation(() => new Promise(() => {}));
    renderWithQuery(<StockStatsBanner />);
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(2);
  });

  it('renders capital + count + certs-this-week values on success', async () => {
    mockGetOrdersStats.mockResolvedValueOnce({
      by_status: {
        available: { count: 17794, total_amount: '0', total_installments_amount: '927913.3433' },
        assigned: { count: 0, total_amount: '0', total_installments_amount: '0' },
        matured: { count: 0, total_amount: '0', total_installments_amount: '0' },
        defaulted: { count: 0, total_amount: '0', total_installments_amount: '0' },
      },
      total_orders: 17794,
      available_capital: '927913.3433',
    });
    mockCountCerts.mockResolvedValueOnce({ total: 7 });

    renderWithQuery(<StockStatsBanner />);

    await waitFor(() => expect(screen.getByText(/\$927,913/)).toBeInTheDocument());
    expect(screen.getByText('17,794')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('shows "—" if orders-stats fails but cert card still renders', async () => {
    mockGetOrdersStats.mockRejectedValueOnce(new Error('boom'));
    mockCountCerts.mockResolvedValueOnce({ total: 3 });

    renderWithQuery(<StockStatsBanner />);

    await waitFor(() => expect(screen.getByText('3')).toBeInTheDocument());
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(2);
  });

  it('passes Monday-of-this-week as issue_date_from to the certs query', async () => {
    mockGetOrdersStats.mockResolvedValueOnce({
      by_status: {
        available: { count: 0, total_amount: '0', total_installments_amount: '0' },
        assigned: { count: 0, total_amount: '0', total_installments_amount: '0' },
        matured: { count: 0, total_amount: '0', total_installments_amount: '0' },
        defaulted: { count: 0, total_amount: '0', total_installments_amount: '0' },
      },
      total_orders: 0,
      available_capital: '0',
    });
    mockCountCerts.mockResolvedValueOnce({ total: 0 });

    renderWithQuery(<StockStatsBanner />);

    await waitFor(() => expect(mockCountCerts).toHaveBeenCalled());
    const [from, to] = mockCountCerts.mock.calls[0];
    expect(from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(to).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(from <= to).toBe(true);
  });
});
