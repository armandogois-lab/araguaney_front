import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { UserProvider } from '@/lib/auth/user-context';
import { InvestorsPage } from './investors-page';
import type { InvestorSummary } from '@/lib/types/investor';

const { mockList } = vi.hoisted(() => ({ mockList: vi.fn() }));

vi.mock('@/lib/api/investors', () => ({
  listInvestors: (...a: unknown[]) => mockList(...a),
  createInvestor: vi.fn(),
  updateInvestor: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

function inv(over: Partial<InvestorSummary> = {}): InvestorSummary {
  return {
    id: 'inv-1',
    legal_name: 'Alpha',
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

const operator = {
  id: 'u-1',
  email: 'op@x.com',
  full_name: 'Op',
  role: 'operator' as const,
  is_active: true,
};
const auditor = { ...operator, role: 'auditor' as const };

function wrap(user: typeof operator, ui: React.ReactElement) {
  return renderWithQuery(<UserProvider user={user}>{ui}</UserProvider>);
}

describe('<InvestorsPage />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockList.mockResolvedValue({ data: [inv()], total: 1, limit: 50, offset: 0 });
  });

  it('renders header + metrics + filters + table for operator', async () => {
    wrap(operator, <InvestorsPage />);
    expect(screen.getByRole('heading', { level: 1, name: /inversores/i })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Alpha')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /registrar inversor/i })).toBeInTheDocument();
  });

  it('hides Registrar inversor for auditor', async () => {
    wrap(auditor, <InvestorsPage />);
    await waitFor(() => expect(screen.getByText('Alpha')).toBeInTheDocument());
    expect(screen.queryByRole('button', { name: /registrar inversor/i })).not.toBeInTheDocument();
  });

  it('clicking a row does NOT open edit modal for auditor', async () => {
    wrap(auditor, <InvestorsPage />);
    await waitFor(() => expect(screen.getByText('Alpha')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Alpha'));
    expect(screen.queryByText(/editar alpha/i)).not.toBeInTheDocument();
  });

  it('clicking a row opens the edit modal for operator', async () => {
    wrap(operator, <InvestorsPage />);
    await waitFor(() => expect(screen.getByText('Alpha')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Alpha'));
    expect(screen.getByText(/editar alpha/i)).toBeInTheDocument();
  });

  it('clicking Registrar opens the create modal', async () => {
    wrap(operator, <InvestorsPage />);
    await waitFor(() => expect(screen.getByText('Alpha')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /registrar inversor/i }));
    // Modal title "Registrar inversor" appears (now there are two matches: button + modal header)
    const matches = screen.getAllByText(/registrar inversor/i);
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });
});
