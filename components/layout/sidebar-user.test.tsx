import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SidebarUser } from './sidebar-user';
import type { MeUser } from '@/lib/api/me';

const mkUser = (overrides: Partial<MeUser> = {}): MeUser => ({
  id: 'u-1',
  email: 'maria@cashea.app',
  full_name: 'María Rodríguez',
  role: 'operator',
  is_active: true,
  ...overrides,
});

describe('<SidebarUser />', () => {
  it('renders the full name and Spanish role label', () => {
    render(<SidebarUser user={mkUser()} />);
    expect(screen.getByText('María Rodríguez')).toBeInTheDocument();
    expect(screen.getByText('Tesorería')).toBeInTheDocument();
  });

  it('computes "MR" initials from "María Rodríguez"', () => {
    render(<SidebarUser user={mkUser()} />);
    expect(screen.getByText('MR')).toBeInTheDocument();
  });

  it('computes "J" initial when only one name part', () => {
    render(<SidebarUser user={mkUser({ full_name: 'Juan' })} />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('uppercases initials regardless of input case', () => {
    render(<SidebarUser user={mkUser({ full_name: 'maría rodríguez' })} />);
    expect(screen.getByText('MR')).toBeInTheDocument();
  });

  it('renders "Administración" for admin role', () => {
    render(<SidebarUser user={mkUser({ role: 'admin' })} />);
    expect(screen.getByText('Administración')).toBeInTheDocument();
  });

  it('renders "Auditoría" for auditor role', () => {
    render(<SidebarUser user={mkUser({ role: 'auditor' })} />);
    expect(screen.getByText('Auditoría')).toBeInTheDocument();
  });
});
