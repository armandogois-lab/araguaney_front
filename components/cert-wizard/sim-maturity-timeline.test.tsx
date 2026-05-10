import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SimMaturityTimeline } from './sim-maturity-timeline';

describe('<SimMaturityTimeline />', () => {
  it('renders a point per due date with compact-formatted amount', () => {
    render(
      <SimMaturityTimeline
        items={[
          { date: '2026-04-27', amount: '0' },
          { date: '2026-05-04', amount: '32180' },
          { date: '2026-06-08', amount: '27252' },
        ]}
      />,
    );
    expect(screen.getByText('27/04')).toBeInTheDocument();
    expect(screen.getByText('04/05')).toBeInTheDocument();
    expect(screen.getByText('08/06')).toBeInTheDocument();
    expect(screen.getByText('$32.2k')).toBeInTheDocument();
    expect(screen.getByText('$27.3k')).toBeInTheDocument();
  });

  it('shows empty state when no items', () => {
    render(<SimMaturityTimeline items={[]} />);
    expect(screen.getByText(/sin distribuci/i)).toBeInTheDocument();
  });

  it('caps display at 8 points and aggregates the tail when more dates exist', () => {
    const items = Array.from({ length: 12 }, (_, i) => ({
      date: `2026-05-${String(i + 1).padStart(2, '0')}`,
      amount: '1000',
    }));
    render(<SimMaturityTimeline items={items} />);
    // First 7 dates should be visible as individual points
    expect(screen.getByText('01/05')).toBeInTheDocument();
    expect(screen.getByText('07/05')).toBeInTheDocument();
    // The 8th point is the aggregated tail bucket labeled with the LAST date
    expect(screen.getByText('12/05')).toBeInTheDocument();
    // Mid-range date 09/05 was folded into the tail
    expect(screen.queryByText('09/05')).not.toBeInTheDocument();
    // Banner reports the aggregation
    expect(screen.getByText(/12 fechas.*5/i)).toBeInTheDocument();
  });
});
