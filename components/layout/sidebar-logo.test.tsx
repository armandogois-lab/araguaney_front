import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SidebarLogo } from './sidebar-logo';

describe('<SidebarLogo />', () => {
  it('renders the brand name and subtitle', () => {
    render(<SidebarLogo />);
    expect(screen.getByText('Araguaney')).toBeInTheDocument();
    expect(screen.getByText('Certificados bursátiles')).toBeInTheDocument();
  });

  it('renders the "A" mark', () => {
    render(<SidebarLogo />);
    expect(screen.getByText('A', { selector: 'div' })).toBeInTheDocument();
  });
});
