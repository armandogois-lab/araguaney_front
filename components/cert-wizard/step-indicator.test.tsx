import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StepIndicator } from './step-indicator';

describe('<StepIndicator />', () => {
  it('marks step 1 active when current=1', () => {
    render(<StepIndicator current={1} />);
    expect(screen.getByTestId('step-1')).toHaveAttribute('data-state', 'active');
    expect(screen.getByTestId('step-2')).toHaveAttribute('data-state', 'pending');
    expect(screen.getByTestId('step-3')).toHaveAttribute('data-state', 'pending');
  });

  it('marks steps 1 and 2 done when current=3', () => {
    render(<StepIndicator current={3} />);
    expect(screen.getByTestId('step-1')).toHaveAttribute('data-state', 'done');
    expect(screen.getByTestId('step-2')).toHaveAttribute('data-state', 'done');
    expect(screen.getByTestId('step-3')).toHaveAttribute('data-state', 'active');
  });

  it('renders Spanish step labels', () => {
    render(<StepIndicator current={1} />);
    expect(screen.getByText('Datos del inversor')).toBeInTheDocument();
    expect(screen.getByText('Simulación del pool')).toBeInTheDocument();
    expect(screen.getByText('Confirmación del borrador')).toBeInTheDocument();
  });
});
