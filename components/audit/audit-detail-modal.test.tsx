import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuditDetailModal } from './audit-detail-modal';
import type { AuditEntry } from '@/lib/types/audit';

function mockEntry(over: Partial<AuditEntry> = {}): AuditEntry {
  return {
    id: 'evt-1',
    occurred_at: '2026-05-13T14:30:00.000Z',
    actor: { id: 'u-1', email: 'maria@cashea.app', full_name: 'María Rodríguez' },
    action: 'create',
    entity_type: 'certificate',
    entity_id: 'cert-uuid-1',
    ip_address: '190.123.45.67',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    payload: { code: 'C4572A', capital: '100000' },
    ...over,
  };
}

describe('<AuditDetailModal />', () => {
  it('renders header with action + entity_type + datetime', () => {
    render(<AuditDetailModal entry={mockEntry()} onClose={vi.fn()} />);
    expect(screen.getByText(/CREATE.*certificate/i)).toBeInTheDocument();
    expect(screen.getByText('13/05/2026 14:30:00')).toBeInTheDocument();
  });

  it('renders actor info', () => {
    render(<AuditDetailModal entry={mockEntry()} onClose={vi.fn()} />);
    expect(screen.getByText(/María Rodríguez/i)).toBeInTheDocument();
    expect(screen.getByText(/maria@cashea\.app/i)).toBeInTheDocument();
    expect(screen.getByText('190.123.45.67')).toBeInTheDocument();
  });

  it('shows "sistema" + "—" when actor and IP are null', () => {
    render(
      <AuditDetailModal
        entry={mockEntry({ actor: null, ip_address: null, user_agent: null })}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText(/sistema/i)).toBeInTheDocument();
  });

  it('renders payload as pretty-printed JSON', () => {
    render(<AuditDetailModal entry={mockEntry()} onClose={vi.fn()} />);
    const pre = screen.getByText(/"code": "C4572A"/);
    expect(pre).toBeInTheDocument();
    expect(pre).toHaveTextContent(/"capital": "100000"/);
  });

  it('shows fallback when payload is empty object', () => {
    render(<AuditDetailModal entry={mockEntry({ payload: {} })} onClose={vi.fn()} />);
    expect(screen.getByText(/sin datos adicionales/i)).toBeInTheDocument();
  });

  it('shows fallback when payload is null', () => {
    render(<AuditDetailModal entry={mockEntry({ payload: null })} onClose={vi.fn()} />);
    expect(screen.getByText(/sin datos adicionales/i)).toBeInTheDocument();
  });

  it('clicking backdrop calls onClose', () => {
    const onClose = vi.fn();
    const { container } = render(<AuditDetailModal entry={mockEntry()} onClose={onClose} />);
    fireEvent.click(container.querySelector('[data-testid="audit-modal-backdrop"]')!);
    expect(onClose).toHaveBeenCalled();
  });

  it('clicking × close button calls onClose', () => {
    const onClose = vi.fn();
    render(<AuditDetailModal entry={mockEntry()} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /^×$/ }));
    expect(onClose).toHaveBeenCalled();
  });
});
