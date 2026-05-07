import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LogoutButton } from './logout-button';

describe('<LogoutButton />', () => {
  it('renders a "Cerrar sesión" button', () => {
    render(<LogoutButton action={vi.fn()} />);
    expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument();
  });

  it('calls action on click', async () => {
    const user = userEvent.setup();
    const action = vi.fn().mockResolvedValue(undefined);
    render(<LogoutButton action={action} />);
    await user.click(screen.getByRole('button', { name: /cerrar sesión/i }));
    expect(action).toHaveBeenCalledTimes(1);
  });
});
