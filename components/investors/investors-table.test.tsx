import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { InvestorsTable } from './investors-table';
import type { InvestorsFiltersValue } from './investors-filters';
import type { InvestorSummary } from '@/lib/types/investor';

const { mockList } = vi.hoisted(() => ({ mockList: vi.fn() }));

vi.mock('@/lib/api/investors', () => ({
  listInvestors: (...a: unknown[]) => mockList(...a),
}));

function inv(over: Partial<InvestorSummary> = {}): InvestorSummary {
  return {
    id: 'inv-' + Math.random(),
    legal_name: 'Inversora Alpha',
    rif: 'J-1',
    kind: 'juridica',
    status: 'active',
    email: null,
    phone: null,
    notes: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    updated_by: null,
    active_cert_count: 1,
    total_invested: '100000.0000',
    ...over,
  };
}

const FILTERS: InvestorsFiltersValue = { status: 'active', q: '' };

describe('<InvestorsTable />', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows skeleton while fetching', () => {
    mockList.mockImplementation(() => new Promise(() => {}));
    renderWithQuery(<InvestorsTable filters={FILTERS} page={0} onPageChange={() => {}} />);
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it('shows empty state when no results', async () => {
    mockList.mockResolvedValueOnce({ data: [], total: 0, limit: 50, offset: 0 });
    renderWithQuery(<InvestorsTable filters={FILTERS} page={0} onPageChange={() => {}} />);
    await waitFor(() => expect(screen.getByText(/ning[uú]n inversor/i)).toBeInTheDocument());
  });

  it('shows error state on failure', async () => {
    mockList.mockRejectedValueOnce(new Error('boom'));
    renderWithQuery(<InvestorsTable filters={FILTERS} page={0} onPageChange={() => {}} />);
    await waitFor(() => expect(screen.getByText(/no se pudieron cargar/i)).toBeInTheDocument());
  });

  it('filters out kind="internal" client-side', async () => {
    mockList.mockResolvedValueOnce({
      data: [
        inv({ legal_name: 'Visible Inv', kind: 'juridica' }),
        inv({ legal_name: 'Cashea Internal', kind: 'internal' }),
      ],
      total: 2,
      limit: 50,
      offset: 0,
    });
    renderWithQuery(<InvestorsTable filters={FILTERS} page={0} onPageChange={() => {}} />);
    await waitFor(() => expect(screen.getByText('Visible Inv')).toBeInTheDocument());
    expect(screen.queryByText('Cashea Internal')).not.toBeInTheDocument();
  });

  it('translates status="all" to undefined in listInvestors call', async () => {
    mockList.mockResolvedValueOnce({ data: [], total: 0, limit: 50, offset: 0 });
    renderWithQuery(
      <InvestorsTable filters={{ ...FILTERS, status: 'all' }} page={0} onPageChange={() => {}} />,
    );
    await waitFor(() => expect(mockList).toHaveBeenCalled());
    expect(mockList.mock.calls[0][0].status).toBeUndefined();
  });

  it('passes onEditInvestor through to rows', async () => {
    mockList.mockResolvedValueOnce({
      data: [inv({ legal_name: 'Clickable Inv' })],
      total: 1,
      limit: 50,
      offset: 0,
    });
    const onEditInvestor = vi.fn();
    renderWithQuery(
      <InvestorsTable
        filters={FILTERS}
        page={0}
        onPageChange={() => {}}
        onEditInvestor={onEditInvestor}
      />,
    );
    await waitFor(() => expect(screen.getByText('Clickable Inv')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Clickable Inv'));
    expect(onEditInvestor).toHaveBeenCalled();
  });
});
