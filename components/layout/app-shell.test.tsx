import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppShell } from './app-shell';
import type { MeUser } from '@/lib/api/me';

vi.mock('next/navigation', () => ({
  usePathname: () => '/cycle',
  redirect: vi.fn(),
}));

const adminUser: MeUser = {
  id: 'u-1',
  email: 'admin@cashea.app',
  full_name: 'Ana Admin',
  role: 'admin',
  is_active: true,
};

describe('<AppShell />', () => {
  it('renders sidebar + main with children for admin user', () => {
    render(
      <AppShell user={adminUser}>
        <div data-testid="page">Cycle page content</div>
      </AppShell>,
    );
    expect(screen.getByText('Araguaney')).toBeInTheDocument();
    expect(screen.getByText('Panel del ciclo')).toBeInTheDocument();
    expect(screen.getByText('Sistema')).toBeInTheDocument();
    expect(screen.getByTestId('page')).toBeInTheDocument();
  });

  it('hides Sistema for operator role', () => {
    render(
      <AppShell user={{ ...adminUser, role: 'operator' }}>
        <div>X</div>
      </AppShell>,
    );
    expect(screen.queryByText('Sistema')).toBeNull();
  });
});
