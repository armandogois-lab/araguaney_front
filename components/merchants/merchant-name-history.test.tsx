import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MerchantNameHistory } from './merchant-name-history';
import type { MerchantNameHistoryItem } from '@/lib/types/merchant';

const HIST: MerchantNameHistoryItem[] = [
  { id: 'h-3', name: 'CENTRAL MADEIRENSE', effective_from: '2026-03-01', effective_to: null },
  { id: 'h-2', name: 'C. MADEIRENSE', effective_from: '2026-02-01', effective_to: '2026-02-28' },
  {
    id: 'h-1',
    name: 'Central Madeirense, C.A.',
    effective_from: '2026-01-01',
    effective_to: '2026-01-31',
  },
];

describe('<MerchantNameHistory />', () => {
  it('renders all rows in the order received', () => {
    render(<MerchantNameHistory items={HIST} />);
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('CENTRAL MADEIRENSE');
    expect(rows[2]).toHaveTextContent('C. MADEIRENSE');
    expect(rows[3]).toHaveTextContent('Central Madeirense, C.A.');
  });

  it('shows "Actual" pill on the row with effective_to=null', () => {
    render(<MerchantNameHistory items={HIST} />);
    expect(screen.getByText('Actual')).toBeInTheDocument();
  });

  it('shows empty message with single entry that is current', () => {
    render(
      <MerchantNameHistory
        items={[
          {
            id: 'h-only',
            name: 'ACME',
            effective_from: '2026-01-01',
            effective_to: null,
          },
        ]}
      />,
    );
    expect(screen.getByText(/sin cambios de nombre/i)).toBeInTheDocument();
  });
});
