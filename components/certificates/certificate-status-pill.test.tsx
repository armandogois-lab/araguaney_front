import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CertificateStatusPill } from './certificate-status-pill';

describe('<CertificateStatusPill />', () => {
  it('renders "Borrador pendiente" for draft status', () => {
    const { container } = render(<CertificateStatusPill status="draft" />);
    expect(screen.getByText(/borrador pendiente/i)).toBeInTheDocument();
    expect(container.querySelector('span')?.className).toContain('bg-warn-bg');
  });

  it('shows "Activo" with success tone for issued', () => {
    const { container } = render(<CertificateStatusPill status="issued" />);
    expect(screen.getByText('Activo')).toBeInTheDocument();
    expect(container.querySelector('span')?.className).toContain('bg-green-bg');
  });

  it('shows "Vencido" with info tone for matured', () => {
    const { container } = render(<CertificateStatusPill status="matured" />);
    expect(screen.getByText('Vencido')).toBeInTheDocument();
    expect(container.querySelector('span')?.className).toContain('bg-info-bg');
  });

  it('shows "Cancelado" with danger tone for cancelled', () => {
    const { container } = render(<CertificateStatusPill status="cancelled" />);
    expect(screen.getByText('Cancelado')).toBeInTheDocument();
    expect(container.querySelector('span')?.className).toContain('bg-rose-100');
  });
});
