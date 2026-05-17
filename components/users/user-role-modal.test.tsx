import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { UserRoleModal } from './user-role-modal';
import type { AppUser } from '@/lib/types/user';

const { mockUpdate } = vi.hoisted(() => ({ mockUpdate: vi.fn() }));
vi.mock('@/lib/api/users', () => ({ updateUser: (...a: unknown[]) => mockUpdate(...a) }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

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

describe('<UserRoleModal />', () => {
  beforeEach(() => mockUpdate.mockReset());

  it('shows current role and target user name', () => {
    renderWithQuery(<UserRoleModal target={user()} onClose={vi.fn()} />);
    expect(screen.getByText(/Cambiar rol de Ana P[eé]rez/)).toBeInTheDocument();
    expect(screen.getByText(/rol actual.*Operador/i)).toBeInTheDocument();
  });

  it('confirm disabled when selected role equals current role', () => {
    renderWithQuery(<UserRoleModal target={user()} onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeDisabled();
  });

  it('selecting a new role enables confirm and calls updateUser', async () => {
    mockUpdate.mockResolvedValueOnce(user({ role: 'admin' }));
    const onClose = vi.fn();
    renderWithQuery(<UserRoleModal target={user()} onClose={onClose} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'admin' } });
    const btn = screen.getByRole('button', { name: /confirmar/i });
    expect(btn).not.toBeDisabled();
    fireEvent.click(btn);
    await new Promise((r) => setTimeout(r, 0));
    expect(mockUpdate).toHaveBeenCalledWith('u-1', { role: 'admin' });
  });

  it('cancel button fires onClose without mutation', () => {
    const onClose = vi.fn();
    renderWithQuery(<UserRoleModal target={user()} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onClose).toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
