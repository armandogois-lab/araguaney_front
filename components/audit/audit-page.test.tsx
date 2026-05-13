import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { AuditPage } from './audit-page';
import type { AuditEntry } from '@/lib/types/audit';

const { mockList } = vi.hoisted(() => ({ mockList: vi.fn() }));

vi.mock('@/lib/api/audit', () => ({
  listAudit: (...a: unknown[]) => mockList(...a),
}));

function entry(over: Partial<AuditEntry> = {}): AuditEntry {
  return {
    id: 'evt-1',
    occurred_at: '2026-05-13T10:00:00.000Z',
    actor: { id: 'u-1', email: 'op@x.com', full_name: 'María' },
    action: 'create',
    entity_type: 'certificate',
    entity_id: 'cert-1',
    ip_address: '1.2.3.4',
    user_agent: 'Mozilla',
    payload: { code: 'C4572A' },
    ...over,
  };
}

describe('<AuditPage />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockList.mockResolvedValue({ data: [entry()], total: 1, limit: 50, offset: 0 });
  });

  it('renders header + filters + table with default 30-day range', async () => {
    renderWithQuery(<AuditPage />);
    expect(screen.getByRole('heading', { level: 1, name: /auditor[íi]a/i })).toBeInTheDocument();
    await waitFor(() => expect(mockList).toHaveBeenCalledTimes(1));
    const arg = mockList.mock.calls[0][0];
    expect(typeof arg.occurred_at_from).toBe('string');
    expect(typeof arg.occurred_at_to).toBe('string');
    expect(arg.occurred_at_from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(arg.occurred_at_to).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('clicking a row opens the detail modal', async () => {
    renderWithQuery(<AuditPage />);
    await waitFor(() => expect(screen.getByText('María')).toBeInTheDocument());
    fireEvent.click(screen.getByText('María'));
    expect(screen.getByText(/CREATE · certificate/i)).toBeInTheDocument();
    expect(screen.getByText(/"code": "C4572A"/)).toBeInTheDocument();
  });
});
