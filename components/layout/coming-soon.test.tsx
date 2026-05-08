import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComingSoon } from './coming-soon';

describe('<ComingSoon />', () => {
  it('renders a "Próximamente" heading and the default message', () => {
    render(<ComingSoon />);
    expect(screen.getByText('Próximamente')).toBeInTheDocument();
    expect(screen.getByText(/disponible en próximos slices/i)).toBeInTheDocument();
  });

  it('renders a custom message when provided', () => {
    render(<ComingSoon message="Pronto verás listados de certificados." />);
    expect(screen.getByText('Pronto verás listados de certificados.')).toBeInTheDocument();
  });
});
