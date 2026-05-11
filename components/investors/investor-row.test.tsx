import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InvestorRow } from './investor-row';
import type { InvestorSummary } from '@/lib/types/investor';

function mockInvestor(over: Partial<InvestorSummary> = {}): InvestorSummary {
  return {
    id: 'inv-1',
    legal_name: 'Inversora Alpha, C.A.',
    rif: 'J-12345678-9',
    kind: 'juridica',
    status: 'active',
    email: 'ops@alpha.com',
    phone: '+58-212-555-1234',
    notes: null,
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-05-01T10:00:00Z',
    updated_by: null,
    active_cert_count: 2,
    total_invested: '450000.0000',
    ...over,
  };
}

describe('<InvestorRow />', () => {
  function wrap(row: React.ReactElement) {
    return render(
      <table>
        <tbody>{row}</tbody>
      </table>,
    );
  }

  it('renders all columns with formatted values', () => {
    wrap(<InvestorRow investor={mockInvestor()} onEdit={vi.fn()} />);
    expect(screen.getByText('Inversora Alpha, C.A.')).toBeInTheDocument();
    expect(screen.getByText('J-12345678-9')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('$450,000.00')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('fires onEdit when clicked', () => {
    const onEdit = vi.fn();
    const inv = mockInvestor();
    wrap(<InvestorRow investor={inv} onEdit={onEdit} />);
    fireEvent.click(screen.getByText('Inversora Alpha, C.A.'));
    expect(onEdit).toHaveBeenCalledWith(inv);
  });

  it('does not fire onEdit when prop is absent', () => {
    const inv = mockInvestor();
    wrap(<InvestorRow investor={inv} />);
    fireEvent.click(screen.getByText('Inversora Alpha, C.A.'));
    // No assertion needed beyond "doesn't throw" — onEdit is optional
  });

  it('shows dash for zero capital', () => {
    wrap(<InvestorRow investor={mockInvestor({ total_invested: '0.0000' })} onEdit={vi.fn()} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
