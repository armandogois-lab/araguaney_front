import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SidebarNavSection } from './sidebar-nav-section';
import type { NavSection } from '@/lib/nav/nav-config';

const sectionAllItems: NavSection = {
  title: 'Operación',
  allowedRoles: ['operator', 'admin', 'auditor'],
  items: [
    { key: 'cycle', label: 'Panel del ciclo', href: '/cycle' },
    { key: 'certificates', label: 'Certificados', href: '/certificates' },
  ],
};

const sectionAdminOnly: NavSection = {
  title: 'Sistema',
  allowedRoles: ['admin', 'auditor'],
  items: [{ key: 'users', label: 'Usuarios', href: '/users', allowedRoles: ['admin'] }],
};

describe('<SidebarNavSection />', () => {
  it('renders the section title in uppercase letter-spaced text', () => {
    render(<SidebarNavSection section={sectionAllItems} pathname="/cycle" role="admin" />);
    expect(screen.getByText('Operación')).toBeInTheDocument();
  });

  it('renders all items when role is allowed for each', () => {
    render(<SidebarNavSection section={sectionAllItems} pathname="/cycle" role="admin" />);
    expect(screen.getByText('Panel del ciclo')).toBeInTheDocument();
    expect(screen.getByText('Certificados')).toBeInTheDocument();
  });

  it('hides items the role is not allowed to see', () => {
    render(<SidebarNavSection section={sectionAdminOnly} pathname="/cycle" role="auditor" />);
    expect(screen.queryByText('Usuarios')).toBeNull();
  });

  it('returns null when no items remain after filtering', () => {
    const { container } = render(
      <SidebarNavSection section={sectionAdminOnly} pathname="/cycle" role="auditor" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('marks the item active when pathname matches its href', () => {
    const { container } = render(
      <SidebarNavSection section={sectionAllItems} pathname="/certificates" role="admin" />,
    );
    const links = container.querySelectorAll('a');
    const cert = Array.from(links).find((l) => l.getAttribute('href') === '/certificates');
    expect(cert?.querySelector('span.bg-yellow')).not.toBeNull();
  });

  it('marks the item active when pathname is a sub-route', () => {
    const { container } = render(
      <SidebarNavSection
        section={sectionAllItems}
        pathname="/certificates/cert-001"
        role="admin"
      />,
    );
    const links = container.querySelectorAll('a');
    const cert = Array.from(links).find((l) => l.getAttribute('href') === '/certificates');
    expect(cert?.querySelector('span.bg-yellow')).not.toBeNull();
  });
});
