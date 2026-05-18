import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { SidebarNav } from './sidebar-nav';

vi.mock('next/navigation', () => ({
  usePathname: () => '/cycle',
}));

const { mockListCertificates } = vi.hoisted(() => ({ mockListCertificates: vi.fn() }));

vi.mock('@/lib/api/certificates', () => ({
  listCertificates: (...a: unknown[]) => mockListCertificates(...a),
}));

describe('<SidebarNav />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // default: no drafts
    mockListCertificates.mockResolvedValue({ data: [], total: 0, limit: 1, offset: 0 });
  });

  it('admin sees all 9 items across 3 sections', () => {
    renderWithQuery(<SidebarNav role="admin" />);
    expect(screen.getByText('Operación')).toBeInTheDocument();
    expect(screen.getByText('Datos')).toBeInTheDocument();
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
    renderWithQuery(<SidebarNav role="auditor" />);
    expect(screen.getByText('Sistema')).toBeInTheDocument();
    expect(screen.getByText('Auditoría')).toBeInTheDocument();
    expect(screen.queryByText('Usuarios')).toBeNull();
  });

  it('operator sees 7 items in 3 sections (Sistema → only Auditoría)', () => {
    renderWithQuery(<SidebarNav role="operator" />);
    expect(screen.getByText('Operación')).toBeInTheDocument();
    expect(screen.getByText('Datos')).toBeInTheDocument();
    expect(screen.getByText('Sistema')).toBeInTheDocument();
    expect(screen.getByText('Auditoría')).toBeInTheDocument();
    expect(screen.queryByText('Trazabilidad')).toBeNull();
    expect(screen.queryByText('Usuarios')).toBeNull();
  });

  it('shows badge on Certificados item for admin when drafts pending', async () => {
    mockListCertificates.mockResolvedValue({ data: [], total: 3, limit: 1, offset: 0 });
    renderWithQuery(<SidebarNav role="admin" />);
    await waitFor(() => expect(screen.getByText('3')).toBeInTheDocument());
  });

  it('hides drafts badge for operator (query not enabled)', () => {
    renderWithQuery(<SidebarNav role="operator" />);
    expect(mockListCertificates).not.toHaveBeenCalled();
    expect(screen.queryByText(/^\d+$/)).toBeNull();
  });
});
