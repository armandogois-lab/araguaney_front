import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SimInvestorBreakdown } from './sim-investor-breakdown';

const sim = {
  capital: '100000.0000',
  investor_returned: '0.5900',
  investor_paid: '99999.4100',
  investor_yield: '1540.5900',
  nominal_actual: '101540.0000',
  maturity_date: '2026-06-08',
} as unknown as Parameters<typeof SimInvestorBreakdown>[0]['simulation'];

describe('<SimInvestorBreakdown />', () => {
  it('renders capital, returned, paid, yield, total with formatted amounts', () => {
    render(<SimInvestorBreakdown simulation={sim} />);
    expect(screen.getByText('$100,000.00')).toBeInTheDocument();
    expect(screen.getByText(/-\$0\.59/)).toBeInTheDocument();
    expect(screen.getByText('$99,999.41')).toBeInTheDocument();
    expect(screen.getByText(/\+\$1,540\.59/)).toBeInTheDocument();
    expect(screen.getByText('$101,540.00')).toBeInTheDocument();
  });

  it('displays the maturity date in the total row label', () => {
    render(<SimInvestorBreakdown simulation={sim} />);
    expect(screen.getByText(/total a recibir.*08\/06\/2026/i)).toBeInTheDocument();
  });

  it('handles a zero shortfall (no negative returned)', () => {
    const exact = { ...sim, investor_returned: '0.0000' } as never;
    render(<SimInvestorBreakdown simulation={exact} />);
    expect(screen.getByText('-$0.00')).toBeInTheDocument();
  });
});
