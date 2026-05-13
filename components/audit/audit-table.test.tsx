import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { AuditTable } from './audit-table';
import type { AuditFiltersValue } from './audit-filters';
import type { AuditEntry } from '@/lib/types/audit';

const { mockList } = vi.hoisted(() => ({ mockList: vi.fn() }));

vi.mock('@/lib/api/audit', () => ({
  listAudit: (...a: unknown[]) => mockList(...a),
}));

function entry(over: Partial<AuditEntry> = {}): AuditEntry {
  return {
    id: 'evt-' + Math.random(),
    occurred_at: '2026-05-13T10:00:00Z',
    actor: { id: 'u-1', email: 'op@x.com', full_name: 'Op' },
    action: 'create',
    entity_type: 'certificate',
    entity_id: 'cert-1',
    ip_address: '1.2.3.4',
    user_agent: 'Mozilla',
    payload: {},
    ...over,
  };
}

const FILTERS: AuditFiltersValue = {
  entityType: 'all',
  action: 'all',
  dateFrom: '2026-04-13',
  dateTo: '2026-05-13',
};

describe('<AuditTable />', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows skeleton while fetching', () => {
    mockList.mockImplementation(() => new Promise(() => {}));
    renderWithQuery(
      <AuditTable filters={FILTERS} page={0} onPageChange={() => {}} onSelectEntry={() => {}} />,
    );
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it('shows empty state when no results', async () => {
    mockList.mockResolvedValueOnce({ data: [], total: 0, limit: 50, offset: 0 });
    renderWithQuery(
      <AuditTable filters={FILTERS} page={0} onPageChange={() => {}} onSelectEntry={() => {}} />,
    );
    await waitFor(() => expect(screen.getByText(/sin eventos/i)).toBeInTheDocument());
  });

  it('shows error state on failure', async () => {
    mockList.mockRejectedValueOnce(new Error('boom'));
    renderWithQuery(
      <AuditTable filters={FILTERS} page={0} onPageChange={() => {}} onSelectEntry={() => {}} />,
    );
    await waitFor(() => expect(screen.getByText(/no se pudieron cargar/i)).toBeInTheDocument());
  });

  it('renders rows + pagination footer', async () => {
    mockList.mockResolvedValueOnce({
      data: [entry(), entry({ id: 'evt-2', action: 'update' })],
      total: 100,
      limit: 50,
      offset: 0,
    });
    renderWithQuery(
      <AuditTable filters={FILTERS} page={0} onPageChange={() => {}} onSelectEntry={() => {}} />,
    );
    await waitFor(() => expect(screen.getByText(/1[–-]50 de 100/)).toBeInTheDocument());
    expect(screen.getByText('Crear')).toBeInTheDocument();
    expect(screen.getByText('Actualizar')).toBeInTheDocument();
  });

  it('translates entityType="all" to undefined in the listAudit call', async () => {
    mockList.mockResolvedValueOnce({ data: [], total: 0, limit: 50, offset: 0 });
    renderWithQuery(
      <AuditTable filters={FILTERS} page={0} onPageChange={() => {}} onSelectEntry={() => {}} />,
    );
    await waitFor(() => expect(mockList).toHaveBeenCalled());
    expect(mockList.mock.calls[0][0].entity_type).toBeUndefined();
    expect(mockList.mock.calls[0][0].action).toBeUndefined();
  });
});
