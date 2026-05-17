import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { UsersPage } from './users-page';
import type { AppUser } from '@/lib/types/user';
import type { MeUser } from '@/lib/api/me';

const { mockList } = vi.hoisted(() => ({ mockList: vi.fn() }));
vi.mock('@/lib/api/users', () => ({
  listUsers: (...a: unknown[]) => mockList(...a),
  updateUser: vi.fn(),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const ME: MeUser = {
  id: 'me-1',
  email: 'me@cashea.app',
  full_name: 'Me Admin',
  role: 'admin',
  is_active: true,
};

function user(over: Partial<AppUser> = {}): AppUser {
  return {
    id: 'u-1',
    email: 'ana@x.com',
    full_name: 'Ana Pérez',
    role: 'operator',
    is_active: true,
    last_login_at: null,
    created_at: '2026-04-01T00:00:00Z',
    ...over,
  };
}

describe('<UsersPage />', () => {
  beforeEach(() => mockList.mockReset());

  it('smoke: header + toolbar + list', async () => {
    mockList.mockResolvedValue({
      data: [user(), { ...user(), id: 'me-1', full_name: 'Me Admin', role: 'admin' as const }],
      total: 2,
    });
    renderWithQuery(<UsersPage me={ME} />);
    expect(screen.getByRole('heading', { level: 1, name: /usuarios/i })).toBeInTheDocument();
    await waitFor(() => expect(mockList).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText('Ana Pérez')).toBeInTheDocument());
    expect(screen.getByText('Me Admin')).toBeInTheDocument();
  });

  it('clicking role pill on other user opens the role modal', async () => {
    mockList.mockResolvedValue({ data: [user()], total: 1 });
    renderWithQuery(<UsersPage me={ME} />);
    await waitFor(() => expect(screen.getByText('Ana Pérez')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /Cambiar rol de Ana P[eé]rez/i }));
    expect(screen.getByText(/Cambiar rol de Ana P[eé]rez/)).toBeInTheDocument();
  });

  it('clicking active pill on other user opens the active modal', async () => {
    mockList.mockResolvedValue({ data: [user()], total: 1 });
    renderWithQuery(<UsersPage me={ME} />);
    await waitFor(() => expect(screen.getByText('Ana Pérez')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /Desactivar Ana P[eé]rez/i }));
    expect(screen.getByText(/Desactivar Ana P[eé]rez/)).toBeInTheDocument();
  });

  it('self row clicks do not open modal', async () => {
    mockList.mockResolvedValue({
      data: [{ ...user(), id: 'me-1', full_name: 'Me Admin' }],
      total: 1,
    });
    renderWithQuery(<UsersPage me={ME} />);
    await waitFor(() => expect(screen.getByText('Me Admin')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /Cambiar rol de Me Admin/i }));
    expect(screen.queryByText(/Cambiar rol/)).toBeNull();
  });

  it('empty state shows message', async () => {
    mockList.mockResolvedValue({ data: [], total: 0 });
    renderWithQuery(<UsersPage me={ME} />);
    await waitFor(() =>
      expect(screen.getByText(/sin usuarios que coincidan/i)).toBeInTheDocument(),
    );
  });
});
