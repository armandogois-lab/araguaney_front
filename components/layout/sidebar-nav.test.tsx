import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SidebarNav } from './sidebar-nav';

vi.mock('next/navigation', () => ({
  usePathname: () => '/cycle',
}));

describe('<SidebarNav />', () => {
  it('admin sees all 9 items across 3 sections', () => {
    render(<SidebarNav role="admin" />);
    expect(screen.getByText('Operación')).toBeInTheDocument();
    expect(screen.getByText('Datos')).toBeInTheDocument();
    expect(screen.getByText('Sistema')).toBeInTheDocument();
    const allLabels = [
      'Panel del ciclo',
      'Certificados',
      'Stock de órdenes',
      'Inversores',
      'Lotes',
      'Comercios',
      'Auditoría',
      'Trazabilidad',
      'Usuarios',
    ];
    for (const label of allLabels) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it('auditor sees 8 items (no Usuarios) in 3 sections', () => {
    render(<SidebarNav role="auditor" />);
    expect(screen.getByText('Sistema')).toBeInTheDocument();
    expect(screen.getByText('Auditoría')).toBeInTheDocument();
    expect(screen.queryByText('Usuarios')).toBeNull();
  });

  it('operator sees 6 items in 2 sections (no Sistema)', () => {
    render(<SidebarNav role="operator" />);
    expect(screen.getByText('Operación')).toBeInTheDocument();
    expect(screen.getByText('Datos')).toBeInTheDocument();
    expect(screen.queryByText('Sistema')).toBeNull();
    expect(screen.queryByText('Auditoría')).toBeNull();
    expect(screen.queryByText('Usuarios')).toBeNull();
  });
});
