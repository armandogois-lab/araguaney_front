import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SimStatCards } from './sim-stat-cards';

const fakeSim = {
  total_distinct_merchants: 71,
  selected_orders: new Array(343).fill({}),
  nominal_actual: '101540.0000',
  installment_plazo_days: { min: 7, max: 42 },
} as unknown as Parameters<typeof SimStatCards>[0]['simulation'];

describe('<SimStatCards />', () => {
  it('renders 4 cards with formatted values', () => {
    render(<SimStatCards simulation={fakeSim} />);
    expect(screen.getByText('71')).toBeInTheDocument();
    expect(screen.getByText('343')).toBeInTheDocument();
    expect(screen.getByText('$101,540.00')).toBeInTheDocument();
    expect(screen.getByText('7—42d')).toBeInTheDocument();
  });

  it('shows total_eligible_merchants in the COMERCIOS sub when provided', () => {
    const sim = { ...fakeSim, total_eligible_merchants: 100 } as never;
    render(<SimStatCards simulation={sim} />);
    expect(screen.getByText(/100 elegibles/)).toBeInTheDocument();
  });
});
