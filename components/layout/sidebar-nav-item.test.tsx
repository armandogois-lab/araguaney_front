import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SidebarNavItem } from './sidebar-nav-item';

describe('<SidebarNavItem />', () => {
  it('renders the label inside a link with the correct href', () => {
    render(<SidebarNavItem label="Certificados" href="/certificates" active={false} />);
    const link = screen.getByRole('link', { name: 'Certificados' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/certificates');
  });

  it('renders an active-state yellow bar when active=true', () => {
    const { container } = render(
      <SidebarNavItem label="Certificados" href="/certificates" active={true} />,
    );
    const bar = container.querySelector('span.bg-yellow');
    expect(bar).not.toBeNull();
  });

  it('does NOT render the yellow bar when active=false', () => {
    const { container } = render(
      <SidebarNavItem label="Certificados" href="/certificates" active={false} />,
    );
    const bar = container.querySelector('span.bg-yellow');
    expect(bar).toBeNull();
  });
});
