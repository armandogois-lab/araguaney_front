import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { InvestorList } from './investor-list';

const { mockListInvestors } = vi.hoisted(() => ({ mockListInvestors: vi.fn() }));

vi.mock('@/lib/api/investors', () => ({
  listInvestors: (...a: unknown[]) => mockListInvestors(...a),
}));

const mkInvestor = (over = {}) => ({
  id: 'inv-1',
  legal_name: 'Inversora Alpha, C.A.',
  rif: 'J-12345678-9',
  kind: 'juridica' as const,
  status: 'active' as const,
  email: null,
  phone: null,
  ...over,
});

describe('<InvestorList />', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows loading state initially', () => {
    mockListInvestors.mockImplementation(() => new Promise(() => {}));
    renderWithQuery(<InvestorList onSelect={vi.fn()} />);
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it('renders investors after data arrives', async () => {
    mockListInvestors.mockResolvedValueOnce({
      data: [mkInvestor(), mkInvestor({ id: 'inv-2', legal_name: 'Beta' })],
      total: 2,
      limit: 50,
      offset: 0,
    });
    renderWithQuery(<InvestorList onSelect={vi.fn()} />);
    await waitFor(() => expect(screen.getByText('Inversora Alpha, C.A.')).toBeInTheDocument());
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('shows empty state when no investors', async () => {
    mockListInvestors.mockResolvedValueOnce({ data: [], total: 0, limit: 50, offset: 0 });
    renderWithQuery(<InvestorList onSelect={vi.fn()} />);
    await waitFor(() => expect(screen.getByText(/no hay inversores/i)).toBeInTheDocument());
  });

  it('clicking a row calls onSelect with the investor', async () => {
    const onSelect = vi.fn();
    mockListInvestors.mockResolvedValueOnce({
      data: [mkInvestor()],
      total: 1,
      limit: 50,
      offset: 0,
    });
    renderWithQuery(<InvestorList onSelect={onSelect} />);
    await waitFor(() => expect(screen.getByText('Inversora Alpha, C.A.')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Inversora Alpha, C.A.'));
    expect(onSelect).toHaveBeenCalledWith(mkInvestor());
  });
});
