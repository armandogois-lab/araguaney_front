import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { StockTable } from './stock-table';
import type { StockFiltersValue } from './stock-filters';
import type { OrderSummary } from '@/lib/types/order';

const { mockListOrders } = vi.hoisted(() => ({ mockListOrders: vi.fn() }));

vi.mock('@/lib/api/orders', () => ({
  listOrders: (...a: unknown[]) => mockListOrders(...a),
}));

function order(overrides: Partial<OrderSummary> = {}): OrderSummary {
  return {
    id: 'o-' + Math.random(),
    external_order_id: '85657474',
    status: 'available',
    purchase_date: '2026-03-18',
    max_due_date: '2026-04-03',
    total_amount: '87.2400',
    installments_sum: '87.2400',
    num_installments: 3,
    imported_at: '2026-05-08T18:15:00Z',
    merchant: { id: 'm-1', current_name: 'CENTRAL MADEIRENSE, C.A', rif: 'J-1' },
    end_user: { id: 'eu-1', external_hash: 'h', national_id: null, full_name: null },
    batch: { id: 'b-1', external_code: 'B-1' },
    ...overrides,
  };
}

const FILTERS: StockFiltersValue = {
  status: 'available',
  merchantId: null,
  maxDueDateLte: null,
  q: '',
};

describe('<StockTable />', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows skeleton while fetching', () => {
    mockListOrders.mockImplementation(() => new Promise(() => {}));
    renderWithQuery(<StockTable filters={FILTERS} page={0} onPageChange={() => {}} />);
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it('shows empty state when filters return zero results', async () => {
    mockListOrders.mockResolvedValueOnce({ data: [], total: 0, limit: 50, offset: 0 });
    renderWithQuery(<StockTable filters={FILTERS} page={0} onPageChange={() => {}} />);
    await waitFor(() => expect(screen.getByText(/ning[uú]n resultado/i)).toBeInTheDocument());
  });

  it('shows error state with retry button on failure', async () => {
    mockListOrders.mockRejectedValueOnce(new Error('boom'));
    renderWithQuery(<StockTable filters={FILTERS} page={0} onPageChange={() => {}} />);
    await waitFor(() => expect(screen.getByText(/no se pudieron cargar/i)).toBeInTheDocument());
  });

  it('renders rows + pagination footer when data arrives', async () => {
    mockListOrders.mockResolvedValueOnce({
      data: [order({ external_order_id: 'A' }), order({ external_order_id: 'B' })],
      total: 100,
      limit: 50,
      offset: 0,
    });
    renderWithQuery(<StockTable filters={FILTERS} page={0} onPageChange={() => {}} />);
    await waitFor(() => expect(screen.getByText('A')).toBeInTheDocument());
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText(/1[–\-]50 de 100/)).toBeInTheDocument();
  });

  it('translates filter status="all" into no status param when calling listOrders', async () => {
    mockListOrders.mockResolvedValueOnce({ data: [], total: 0, limit: 50, offset: 0 });
    renderWithQuery(
      <StockTable filters={{ ...FILTERS, status: 'all' }} page={0} onPageChange={() => {}} />,
    );
    await waitFor(() => expect(mockListOrders).toHaveBeenCalled());
    const args = mockListOrders.mock.calls[0][0];
    expect(args.status).toBeUndefined();
  });

  it('triggers onPageChange when the next-page button is clicked', async () => {
    mockListOrders.mockResolvedValueOnce({
      data: [order()],
      total: 200,
      limit: 50,
      offset: 0,
    });
    const onPageChange = vi.fn();
    renderWithQuery(<StockTable filters={FILTERS} page={0} onPageChange={onPageChange} />);
    await waitFor(() => expect(screen.getByLabelText(/p[aá]gina siguiente/i)).toBeInTheDocument());
    fireEvent.click(screen.getByLabelText(/p[aá]gina siguiente/i));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
