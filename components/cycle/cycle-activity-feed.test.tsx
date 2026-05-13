import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { CycleActivityFeed, formatActivityEntry } from './cycle-activity-feed';
import type { AuditEntry, AuditListResponse } from '@/lib/types/audit';

function entry(over: Partial<AuditEntry> = {}): AuditEntry {
  return {
    id: 'evt-1',
    occurred_at: '2026-05-13T10:00:00Z',
    actor: { id: 'u-1', email: 'maria@x.com', full_name: 'María Rodríguez' },
    action: 'create',
    entity_type: 'certificate',
    entity_id: 'cert-uuid-1',
    ip_address: '1.2.3.4',
    user_agent: 'Mozilla',
    payload: { certificate_code: 'C4572A' },
    ...over,
  };
}

function q(data?: AuditListResponse, over: Partial<UseQueryResult<AuditListResponse>> = {}) {
  return { data, isLoading: false, isError: false, ...over } as UseQueryResult<AuditListResponse>;
}

describe('formatActivityEntry', () => {
  it('certificate create with code in payload → "creó certificado C4572A"', () => {
    const { node } = formatActivityEntry(entry());
    // Render to dom to read text
    const dom = render(<>{node}</>);
    expect(dom.container.textContent).toContain('María Rodríguez');
    expect(dom.container.textContent).toContain('creó certificado C4572A');
  });

  it('investor update fallback when no code in payload', () => {
    const e = entry({
      action: 'update',
      entity_type: 'investor',
      entity_id: '11111111-2222-3333-4444-555555555555',
      payload: {},
    });
    const { node } = formatActivityEntry(e);
    const dom = render(<>{node}</>);
    expect(dom.container.textContent).toContain('actualizó inversor');
    expect(dom.container.textContent).toContain('11111111');
  });

  it('null actor renders "sistema"', () => {
    const e = entry({ actor: null });
    const { node } = formatActivityEntry(e);
    const dom = render(<>{node}</>);
    expect(dom.container.textContent).toContain('sistema');
  });
});

describe('<CycleActivityFeed />', () => {
  it('renders top 5 entries', () => {
    const data: AuditListResponse = {
      data: Array.from({ length: 8 }, (_, i) =>
        entry({ id: 'e-' + i, payload: { certificate_code: 'C' + i } }),
      ),
      total: 8,
      limit: 50,
      offset: 0,
    };
    render(<CycleActivityFeed auditQ={q(data)} />);
    expect(screen.getByText(/C0/)).toBeInTheDocument();
    expect(screen.getByText(/C4/)).toBeInTheDocument();
    expect(screen.queryByText(/C5/)).not.toBeInTheDocument();
  });

  it('empty state', () => {
    const empty: AuditListResponse = { data: [], total: 0, limit: 50, offset: 0 };
    render(<CycleActivityFeed auditQ={q(empty)} />);
    expect(screen.getByText(/sin actividad esta semana/i)).toBeInTheDocument();
  });
});
