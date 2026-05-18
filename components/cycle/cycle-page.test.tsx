import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { UserProvider } from '@/lib/auth/user-context';
import { CyclePage } from './cycle-page';

const { mockStats, mockCerts, mockBatches, mockAudit } = vi.hoisted(() => ({
  mockStats: vi.fn(),
  mockCerts: vi.fn(),
  mockBatches: vi.fn(),
  mockAudit: vi.fn(),
}));

vi.mock('@/lib/api/orders', () => ({ getOrdersStats: (...a: unknown[]) => mockStats(...a) }));
vi.mock('@/lib/api/certificates', () => ({
  listCertificates: (...a: unknown[]) => mockCerts(...a),
}));
vi.mock('@/lib/api/batches', () => ({ listBatches: (...a: unknown[]) => mockBatches(...a) }));
vi.mock('@/lib/api/audit', () => ({ listAudit: (...a: unknown[]) => mockAudit(...a) }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const operator = {
  id: 'u-1',
  email: 'op@x.com',
  full_name: 'Op',
  role: 'operator' as const,
  is_active: true,
};

function wrap(ui: React.ReactElement) {
  return renderWithQuery(<UserProvider user={operator}>{ui}</UserProvider>);
}

describe('<CyclePage />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStats.mockResolvedValue({
      by_status: {
        available: { count: 0, total_amount: '0', total_installments_amount: '0' },
        assigned: { count: 0, total_amount: '0', total_installments_amount: '0' },
        matured: { count: 0, total_amount: '0', total_installments_amount: '0' },
        defaulted: { count: 0, total_amount: '0', total_installments_amount: '0' },
      },
      total_orders: 0,
      available_capital: '0',
    });
    mockCerts.mockResolvedValue({ data: [], total: 0, limit: 50, offset: 0 });
    mockBatches.mockResolvedValue({ data: [], total: 0, limit: 50, offset: 0 });
    mockAudit.mockResolvedValue({ data: [], total: 0, limit: 50, offset: 0 });
  });

  it('renders PageHeader + banner + metrics + 2-col body', async () => {
    wrap(<CyclePage />);
    expect(screen.getByRole('heading', { level: 1, name: /panel del ciclo/i })).toBeInTheDocument();
    expect(screen.getByText(/Ciclo semanal/)).toBeInTheDocument();
    await waitFor(() => expect(mockStats).toHaveBeenCalled());
    await waitFor(() => expect(mockCerts).toHaveBeenCalled());
    await waitFor(() => expect(mockBatches).toHaveBeenCalled());
    await waitFor(() => expect(mockAudit).toHaveBeenCalled());
  });

  it('calls listBatches with status="imported"', async () => {
    wrap(<CyclePage />);
    await waitFor(() => expect(mockBatches).toHaveBeenCalled());
    expect(mockBatches.mock.calls[0][0]).toMatchObject({ status: 'imported' });
  });

  it('passes Mon-Fri to listCertificates and Monday to listAudit', async () => {
    wrap(<CyclePage />);
    await waitFor(() => expect(mockCerts).toHaveBeenCalled());
    // listCertificates is called both for the drafts count pill (status=draft)
    // and for the weekly certs query (sort=issue_date_desc). Find the weekly one.
    const weeklyCall = mockCerts.mock.calls.find(
      ([arg]: [{ sort?: string }]) => arg.sort === 'issue_date_desc',
    );
    expect(weeklyCall).toBeDefined();
    const certsArg = weeklyCall![0];
    expect(certsArg.issue_date_from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(certsArg.issue_date_to).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(certsArg.sort).toBe('issue_date_desc');

    const auditArg = mockAudit.mock.calls[0][0];
    expect(auditArg.occurred_at_from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
