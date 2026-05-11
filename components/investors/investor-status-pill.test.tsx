import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InvestorStatusPill } from './investor-status-pill';

describe('<InvestorStatusPill />', () => {
  it('shows "Activo" with success tone for active', () => {
    render(<InvestorStatusPill status="active" />);
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('shows "Inactivo" with neutral tone for inactive', () => {
    render(<InvestorStatusPill status="inactive" />);
    expect(screen.getByText('Inactivo')).toBeInTheDocument();
  });
});
