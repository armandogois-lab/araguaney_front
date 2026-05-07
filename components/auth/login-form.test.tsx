import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './login-form';

describe('<LoginForm />', () => {
  it('renders email and password fields and a submit button', () => {
    render(<LoginForm action={vi.fn().mockResolvedValue({ error: null })} />);
    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<LoginForm action={vi.fn().mockResolvedValue({ error: null })} />);
    await user.click(screen.getByRole('button', { name: /ingresar/i }));
    expect(await screen.findByText(/correo inválido/i)).toBeInTheDocument();
  });

  it('calls action with FormData when valid', async () => {
    const user = userEvent.setup();
    const action = vi.fn().mockResolvedValue({ error: null });
    render(<LoginForm action={action} />);
    await user.type(screen.getByLabelText(/correo/i), 'test@cashea.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'secret123');
    await user.click(screen.getByRole('button', { name: /ingresar/i }));
    expect(action).toHaveBeenCalledTimes(1);
    const fd = action.mock.calls[0][0] as FormData;
    expect(fd.get('email')).toBe('test@cashea.com');
    expect(fd.get('password')).toBe('secret123');
  });

  it('renders error message returned by action', async () => {
    const user = userEvent.setup();
    const action = vi.fn().mockResolvedValue({ error: 'Invalid credentials' });
    render(<LoginForm action={action} />);
    await user.type(screen.getByLabelText(/correo/i), 'test@cashea.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /ingresar/i }));
    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });
});
