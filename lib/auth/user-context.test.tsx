import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserProvider, useUser } from './user-context';
import type { MeUser } from '@/lib/api/me';

const user: MeUser = {
  id: 'u-1',
  email: 'a@b.com',
  full_name: 'Test User',
  role: 'admin',
  is_active: true,
};

function Probe() {
  const u = useUser();
  return <div data-testid="probe">{u.full_name}</div>;
}

describe('UserProvider / useUser', () => {
  it('exposes the user from provider', () => {
    render(
      <UserProvider user={user}>
        <Probe />
      </UserProvider>,
    );
    expect(screen.getByTestId('probe').textContent).toBe('Test User');
  });

  it('throws when useUser is called outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/UserProvider/);
    spy.mockRestore();
  });
});
