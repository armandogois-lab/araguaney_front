import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RolePill } from './role-pill';

describe('<RolePill />', () => {
  it('renders "Admin" for admin role', () => {
    render(<RolePill role="admin" />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
  it('renders "Operador" for operator role', () => {
    render(<RolePill role="operator" />);
    expect(screen.getByText('Operador')).toBeInTheDocument();
  });
  it('renders "Auditor" for auditor role', () => {
    render(<RolePill role="auditor" />);
    expect(screen.getByText('Auditor')).toBeInTheDocument();
  });
});
