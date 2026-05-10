import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SimConcentrationBars } from './sim-concentration-bars';

describe('<SimConcentrationBars />', () => {
  it('renders one row per merchant with name, amount, and pct', () => {
    render(
      <SimConcentrationBars
        items={[
          {
            merchant_id: 'm-1',
            current_name: 'Central Madeirense',
            rif: 'J-1',
            amount: '17478.0000',
            pct: '0.172',
          },
          {
            merchant_id: 'm-2',
            current_name: 'Corpocel Store',
            rif: 'J-2',
            amount: '9528.0000',
            pct: '0.094',
          },
        ]}
      />,
    );
    expect(screen.getByText('Central Madeirense')).toBeInTheDocument();
    expect(screen.getByText(/\$17,478/)).toBeInTheDocument();
    expect(screen.getByText(/17\.2%/)).toBeInTheDocument();
    expect(screen.getByText('Corpocel Store')).toBeInTheDocument();
    expect(screen.getByText(/9\.4%/)).toBeInTheDocument();
  });

  it('renders empty state when items is empty', () => {
    render(<SimConcentrationBars items={[]} />);
    expect(screen.getByText(/sin datos de concentraci/i)).toBeInTheDocument();
  });

  it('bar widths are proportional to top item (largest = 100%)', () => {
    const { container } = render(
      <SimConcentrationBars
        items={[
          {
            merchant_id: 'm-1',
            current_name: 'A',
            rif: 'J-1',
            amount: '100',
            pct: '0.5',
          },
          {
            merchant_id: 'm-2',
            current_name: 'B',
            rif: 'J-2',
            amount: '50',
            pct: '0.25',
          },
        ]}
      />,
    );
    const bars = container.querySelectorAll('[data-testid="conc-bar"]');
    expect((bars[0] as HTMLElement).style.width).toBe('100%');
    expect((bars[1] as HTMLElement).style.width).toBe('50%');
  });
});
