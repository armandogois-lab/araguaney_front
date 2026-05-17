import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserRow } from './user-row';
import type { AppUser } from '@/lib/types/user';

function user(over: Partial<AppUser> = {}): AppUser {
  return {
    id: 'u-1',
    email: 'ana@x.com',
    full_name: 'Ana Pérez',
    role: 'operator',
    is_active: true,
    last_login_at: '2026-05-10T15:30:00Z',
    created_at: '2026-04-01T00:00:00Z',
    ...over,
  };
}

describe('<UserRow />', () => {
  it('renders email, full_name, role pill, last_login, created_at', () => {
    render(<UserRow user={user()} isSelf={false} onEditRole={vi.fn()} onToggleActive={vi.fn()} />);
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('ana@x.com')).toBeInTheDocument();
    expect(screen.getByText('Operador')).toBeInTheDocument();
    expect(screen.getByText(/10\/05\/2026/)).toBeInTheDocument();
    expect(screen.getByText(/01\/04\/2026/)).toBeInTheDocument();
  });

  it('shows "Nunca" when last_login_at is null', () => {
    render(
      <UserRow
        user={user({ last_login_at: null })}
        isSelf={false}
        onEditRole={vi.fn()}
        onToggleActive={vi.fn()}
      />,
    );
    expect(screen.getByText(/nunca/i)).toBeInTheDocument();
  });

  it('fires onEditRole when role pill clicked', () => {
    const onEditRole = vi.fn();
    render(
      <UserRow user={user()} isSelf={false} onEditRole={onEditRole} onToggleActive={vi.fn()} />,
    );
    fireEvent.click(screen.getByText('Operador'));
    expect(onEditRole).toHaveBeenCalledWith(user());
  });

  it('fires onToggleActive when active switch clicked', () => {
    const onToggleActive = vi.fn();
    render(
      <UserRow user={user()} isSelf={false} onEditRole={vi.fn()} onToggleActive={onToggleActive} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /desactivar/i }));
    expect(onToggleActive).toHaveBeenCalledWith(user());
  });

  it('is read-only when isSelf=true', () => {
    const onEditRole = vi.fn();
    const onToggleActive = vi.fn();
    render(
      <UserRow
        user={user()}
        isSelf={true}
        onEditRole={onEditRole}
        onToggleActive={onToggleActive}
      />,
    );
    fireEvent.click(screen.getByText('Operador'));
    fireEvent.click(screen.getByText(/activo/i));
    expect(onEditRole).not.toHaveBeenCalled();
    expect(onToggleActive).not.toHaveBeenCalled();
    expect(screen.getByTitle(/no pod[eé]s editarte/i)).toBeInTheDocument();
  });
});
