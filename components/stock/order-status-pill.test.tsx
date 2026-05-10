import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { OrderStatusPill } from './order-status-pill';

describe('<OrderStatusPill />', () => {
  it('shows "Disponible" with success tone for available', () => {
    const { container, getByText } = render(<OrderStatusPill status="available" />);
    expect(getByText('Disponible')).toBeInTheDocument();
    expect(container.querySelector('span')?.className).toContain('bg-green-bg');
  });

  it('shows "Asignada" with warn tone for assigned', () => {
    const { container, getByText } = render(<OrderStatusPill status="assigned" />);
    expect(getByText('Asignada')).toBeInTheDocument();
    expect(container.querySelector('span')?.className).toContain('bg-warn-bg');
  });

  it('shows "Vencida" with neutral tone for matured', () => {
    const { container, getByText } = render(<OrderStatusPill status="matured" />);
    expect(getByText('Vencida')).toBeInTheDocument();
    expect(container.querySelector('span')?.className).toContain('bg-neutral-bg');
  });

  it('shows "Defaulteada" with danger tone for defaulted', () => {
    const { container, getByText } = render(<OrderStatusPill status="defaulted" />);
    expect(getByText('Defaulteada')).toBeInTheDocument();
    expect(container.querySelector('span')?.className).toContain('bg-rose-100');
  });
});
