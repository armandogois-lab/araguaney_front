import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { UserActiveModal } from './user-active-modal';
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

describe('<UserActiveModal />', () => {
  beforeEach(() => mockUpdate.mockReset());

  it('shows deactivate copy when target is active', () => {
    renderWithQuery(<UserActiveModal target={user({ is_active: true })} onClose={vi.fn()} />);
    expect(screen.getByText(/Desactivar Ana P[eé]rez/)).toBeInTheDocument();
    expect(screen.getByText(/perder[aá] acceso/i)).toBeInTheDocument();
  });

  it('shows activate copy when target is inactive', () => {
    renderWithQuery(<UserActiveModal target={user({ is_active: false })} onClose={vi.fn()} />);
    expect(screen.getByText(/Activar Ana P[eé]rez/)).toBeInTheDocument();
  });

  it('confirm calls updateUser with the toggled value', async () => {
    mockUpdate.mockResolvedValueOnce(user({ is_active: false }));
    renderWithQuery(<UserActiveModal target={user({ is_active: true })} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));
    await new Promise((r) => setTimeout(r, 0));
    expect(mockUpdate).toHaveBeenCalledWith('u-1', { is_active: false });
  });

  it('cancel button fires onClose without mutation', () => {
    const onClose = vi.fn();
    renderWithQuery(<UserActiveModal target={user()} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onClose).toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
