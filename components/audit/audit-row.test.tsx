import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuditRow } from './audit-row';
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
    user_agent: 'Mozilla/5.0',
    payload: { code: 'C4572A' },
    ...over,
  };
}

describe('<AuditRow />', () => {
  function wrap(row: React.ReactElement) {
    return render(
      <table>
        <tbody>{row}</tbody>
      </table>,
    );
  }

  it('renders all columns', () => {
    wrap(<AuditRow entry={mockEntry()} onSelect={vi.fn()} />);
    expect(screen.getByText('13/05/2026 14:30:00')).toBeInTheDocument();
    expect(screen.getByText('María Rodríguez')).toBeInTheDocument();
    expect(screen.getByText('Crear')).toBeInTheDocument();
    expect(screen.getByText('certificate')).toBeInTheDocument();
    expect(screen.getByText('cert-uuid-1')).toBeInTheDocument();
    expect(screen.getByText('190.123.45.67')).toBeInTheDocument();
  });

  it('fires onSelect with the entry on click', () => {
    const onSelect = vi.fn();
    const entry = mockEntry();
    wrap(<AuditRow entry={entry} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Crear'));
    expect(onSelect).toHaveBeenCalledWith(entry);
  });

  it('shows "sistema" when actor is null', () => {
    wrap(<AuditRow entry={mockEntry({ actor: null })} onSelect={vi.fn()} />);
    expect(screen.getByText('sistema')).toBeInTheDocument();
  });
});
