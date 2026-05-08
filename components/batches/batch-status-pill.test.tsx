import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BatchStatusPill } from './batch-status-pill';

describe('<BatchStatusPill />', () => {
  it('renders "Activo" with success variant for imported', () => {
    const { container } = render(<BatchStatusPill status="imported" />);
    expect(screen.getByText('Activo')).toBeInTheDocument();
    expect(container.querySelector('span.bg-green-bg')).not.toBeNull();
  });

  it('renders "Subido" with info variant for uploaded', () => {
    const { container } = render(<BatchStatusPill status="uploaded" />);
    expect(screen.getByText('Subido')).toBeInTheDocument();
    expect(container.querySelector('span.bg-info-bg')).not.toBeNull();
  });

  it('renders "Procesando" with info variant for parsing', () => {
    const { container } = render(<BatchStatusPill status="parsing" />);
    expect(screen.getByText('Procesando')).toBeInTheDocument();
    expect(container.querySelector('span.bg-info-bg')).not.toBeNull();
  });

  it('renders "Rechazado" with warn variant for rejected', () => {
    const { container } = render(<BatchStatusPill status="rejected" />);
    expect(screen.getByText('Rechazado')).toBeInTheDocument();
    expect(container.querySelector('span.bg-warn-bg')).not.toBeNull();
  });

  it('renders "Archivado" with neutral variant for archived', () => {
    const { container } = render(<BatchStatusPill status="archived" />);
    expect(screen.getByText('Archivado')).toBeInTheDocument();
    expect(container.querySelector('span.bg-neutral-bg')).not.toBeNull();
  });
});
