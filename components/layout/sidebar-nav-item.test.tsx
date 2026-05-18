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

  it('renders badge when prop is > 0', () => {
    render(<SidebarNavItem href="/x" label="Items" active={false} badge={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('hides badge when prop is 0', () => {
    render(<SidebarNavItem href="/x" label="Items" active={false} badge={0} />);
    expect(screen.queryByText('0')).toBeNull();
  });

  it('hides badge when prop is undefined', () => {
    const { container } = render(<SidebarNavItem href="/x" label="Items" active={false} />);
    // only the dot bullet and label — no numeric badge span
    const spans = container.querySelectorAll('span');
    const hasNumericText = Array.from(spans).some((s) => /^\d+$/.test(s.textContent ?? ''));
    expect(hasNumericText).toBe(false);
  });
});
