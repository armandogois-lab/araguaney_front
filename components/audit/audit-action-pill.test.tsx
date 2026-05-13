import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuditActionPill } from './audit-action-pill';

describe('<AuditActionPill />', () => {
  it('shows "Crear" with success tone for create', () => {
    render(<AuditActionPill action="create" />);
    expect(screen.getByText('Crear')).toBeInTheDocument();
  });

  it('shows "Actualizar" with info tone for update', () => {
    render(<AuditActionPill action="update" />);
    expect(screen.getByText('Actualizar')).toBeInTheDocument();
  });

  it('shows "Cancelar" with danger tone for cancel', () => {
    render(<AuditActionPill action="cancel" />);
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('shows "Otorgar" for grant and "Revocar" for revoke', () => {
    const { rerender } = render(<AuditActionPill action="grant" />);
    expect(screen.getByText('Otorgar')).toBeInTheDocument();
    rerender(<AuditActionPill action="revoke" />);
    expect(screen.getByText('Revocar')).toBeInTheDocument();
  });

  it('falls back to raw action string for unknown actions', () => {
    render(<AuditActionPill action="something_new" />);
    expect(screen.getByText('something_new')).toBeInTheDocument();
  });
});
