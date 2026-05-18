import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MerchantStatusBreakdown } from './merchant-status-breakdown';

describe('<MerchantStatusBreakdown />', () => {
  it('renders 4 statuses in fixed order with Spanish labels', () => {
    render(
      <MerchantStatusBreakdown
        byStatus={{ available: 5, assigned: 10, matured: 3, defaulted: 1 }}
      />,
    );
    const labels = screen.getAllByTestId('status-label').map((el) => el.textContent);
    expect(labels).toEqual(['Disponibles', 'Asignadas', 'Vencidas', 'En default']);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows empty message when all counts are 0', () => {
    render(
      <MerchantStatusBreakdown
        byStatus={{ available: 0, assigned: 0, matured: 0, defaulted: 0 }}
      />,
    );
    expect(screen.getByText(/sin órdenes registradas/i)).toBeInTheDocument();
  });
});
