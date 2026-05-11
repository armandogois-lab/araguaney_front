import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { InvestorMetricsStrip } from './investor-metrics-strip';
import type { InvestorsFiltersValue } from './investors-filters';

const { mockList } = vi.hoisted(() => ({ mockList: vi.fn() }));

vi.mock('@/lib/api/investors', () => ({
  listInvestors: (...a: unknown[]) => mockList(...a),
}));

const FILTERS: InvestorsFiltersValue = { status: 'active', q: '' };

describe('<InvestorMetricsStrip />', () => {
  beforeEach(() => vi.clearAllMocks());

  it('counts active investors and sums their capital', async () => {
    mockList.mockResolvedValueOnce({
      data: [
        {
          id: 'a',
          legal_name: 'A',
          rif: 'J-1',
          kind: 'juridica',
          status: 'active',
          email: null,
          phone: null,
          notes: null,
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
          updated_by: null,
          active_cert_count: 2,
          total_invested: '300000.0000',
        },
        {
          id: 'b',
          legal_name: 'B',
          rif: 'J-2',
          kind: 'juridica',
          status: 'inactive',
          email: null,
          phone: null,
          notes: null,
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
          updated_by: null,
          active_cert_count: 0,
          total_invested: '0.0000',
        },
        {
          id: 'c',
          legal_name: 'C',
          rif: 'J-3',
          kind: 'juridica',
          status: 'active',
          email: null,
          phone: null,
          notes: null,
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
          updated_by: null,
          active_cert_count: 1,
          total_invested: '150000.0000',
        },
      ],
      total: 3,
      limit: 50,
      offset: 0,
    });
    renderWithQuery(<InvestorMetricsStrip filters={FILTERS} page={0} />);
    await waitFor(() => expect(screen.getByText('2')).toBeInTheDocument());
    expect(screen.getByText('$450,000.00')).toBeInTheDocument();
  });

  it('renders zero state when data is empty', async () => {
    mockList.mockResolvedValueOnce({ data: [], total: 0, limit: 50, offset: 0 });
    renderWithQuery(<InvestorMetricsStrip filters={FILTERS} page={0} />);
    await waitFor(() => expect(screen.getByText('$0.00')).toBeInTheDocument());
  });

  it('renders labels even during load', () => {
    mockList.mockImplementation(() => new Promise(() => {}));
    renderWithQuery(<InvestorMetricsStrip filters={FILTERS} page={0} />);
    expect(screen.getByText(/inversores activos/i)).toBeInTheDocument();
    expect(screen.getByText(/capital colocado/i)).toBeInTheDocument();
  });
});
