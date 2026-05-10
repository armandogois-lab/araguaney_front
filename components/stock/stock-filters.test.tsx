import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { StockFilters, type StockFiltersValue } from './stock-filters';

const { mockListMerchants } = vi.hoisted(() => ({ mockListMerchants: vi.fn() }));

vi.mock('@/lib/api/merchants', () => ({
  listMerchants: (...a: unknown[]) => mockListMerchants(...a),
}));

const DEFAULT_VALUE: StockFiltersValue = {
  status: 'available',
  merchantId: null,
  maxDueDateLte: null,
  q: '',
};

describe('<StockFilters />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockListMerchants.mockResolvedValue({
      data: [
        {
          id: 'm-1',
          rif: 'J-1',
          current_name: 'Mercantil C.A.',
          first_seen_at: '2026-05-01T00:00:00Z',
          last_seen_at: '2026-05-08T00:00:00Z',
          order_count: 5,
          total_orders_amount: '1500.0000',
        },
        {
          id: 'm-2',
          rif: 'J-2',
          current_name: 'Bodegón XYZ',
          first_seen_at: '2026-05-01T00:00:00Z',
          last_seen_at: '2026-05-08T00:00:00Z',
          order_count: 3,
          total_orders_amount: '900.0000',
        },
      ],
      total: 2,
      limit: 200,
      offset: 0,
    });
  });

  it('renders the four status pills with "Disponibles" active by default', () => {
    renderWithQuery(<StockFilters value={DEFAULT_VALUE} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Disponibles' })).toHaveAttribute(
      'data-active',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Todas' })).toHaveAttribute('data-active', 'false');
  });

  it('emits onChange with status="all" when "Todas" is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithQuery(<StockFilters value={DEFAULT_VALUE} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Todas' }));
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT_VALUE, status: 'all' });
  });

  it('emits onChange with merchantId when a merchant is selected', async () => {
    const onChange = vi.fn();
    renderWithQuery(<StockFilters value={DEFAULT_VALUE} onChange={onChange} />);
    await waitFor(() => expect(mockListMerchants).toHaveBeenCalled());
    const select = await screen.findByLabelText(/comercio/i);
    fireEvent.change(select, { target: { value: 'm-1' } });
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT_VALUE, merchantId: 'm-1' });
  });

  it('emits onChange with maxDueDateLte when the date input changes', () => {
    const onChange = vi.fn();
    renderWithQuery(<StockFilters value={DEFAULT_VALUE} onChange={onChange} />);
    const input = screen.getByLabelText(/vence antes/i);
    fireEvent.change(input, { target: { value: '2026-05-31' } });
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT_VALUE, maxDueDateLte: '2026-05-31' });
  });

  it('debounces the search input by 300ms before emitting onChange.q', async () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    renderWithQuery(<StockFilters value={DEFAULT_VALUE} onChange={onChange} />);
    const input = screen.getByPlaceholderText(/c[oó]digo/i);
    fireEvent.change(input, { target: { value: '8565' } });
    expect(onChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(310);
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT_VALUE, q: '8565' });
    vi.useRealTimers();
  });
});
