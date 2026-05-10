import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SimMaturityTimeline } from './sim-maturity-timeline';

describe('<SimMaturityTimeline />', () => {
  it('renders a point per due date with formatted amount', () => {
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
    expect(screen.getByText('$32,180')).toBeInTheDocument();
  });

  it('shows empty state when no items', () => {
    render(<SimMaturityTimeline items={[]} />);
    expect(screen.getByText(/sin distribuci/i)).toBeInTheDocument();
  });
});
