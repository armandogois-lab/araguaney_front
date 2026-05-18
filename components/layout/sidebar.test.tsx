import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { Sidebar } from './sidebar';
import type { MeUser } from '@/lib/api/me';

vi.mock('next/navigation', () => ({
  usePathname: () => '/cycle',
  redirect: vi.fn(),
}));

vi.mock('@/lib/api/certificates', () => ({
  listCertificates: vi.fn().mockResolvedValue({ data: [], total: 0, limit: 1, offset: 0 }),
}));

const user: MeUser = {
  id: 'u-1',
  email: 'maria@cashea.app',
  full_name: 'María Rodríguez',
  role: 'admin',
  is_active: true,
};

describe('<Sidebar />', () => {
  it('renders logo, nav, user, and a logout button', () => {
    renderWithQuery(<Sidebar user={user} />);
    expect(screen.getByText('Araguaney')).toBeInTheDocument();
    expect(screen.getByText('Panel del ciclo')).toBeInTheDocument();
    expect(screen.getByText('María Rodríguez')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument();
  });

  it('logout button is inside a form posting to the logoutAction', () => {
    const { container } = renderWithQuery(<Sidebar user={user} />);
    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    const button = form?.querySelector('button[type="submit"]');
    expect(button?.textContent).toMatch(/cerrar sesión/i);
  });
});
