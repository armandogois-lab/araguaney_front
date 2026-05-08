import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UploadButton } from './upload-button';
import { UserProvider } from '@/lib/auth/user-context';
import type { MeUser } from '@/lib/api/me';

const mkUser = (role: MeUser['role']): MeUser => ({
  id: 'u-1',
  email: 'a@b.com',
  full_name: 'Test',
  role,
  is_active: true,
});

describe('<UploadButton />', () => {
  it('renders for operator role', () => {
    render(
      <UserProvider user={mkUser('operator')}>
        <UploadButton onClick={vi.fn()} />
      </UserProvider>,
    );
    expect(screen.getByRole('button', { name: 'Subir lote' })).toBeInTheDocument();
  });

  it('renders for admin role', () => {
    render(
      <UserProvider user={mkUser('admin')}>
        <UploadButton onClick={vi.fn()} />
      </UserProvider>,
    );
    expect(screen.getByRole('button', { name: 'Subir lote' })).toBeInTheDocument();
  });

  it('does not render for auditor role', () => {
    const { container } = render(
      <UserProvider user={mkUser('auditor')}>
        <UploadButton onClick={vi.fn()} />
      </UserProvider>,
    );
    expect(container.querySelector('button')).toBeNull();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <UserProvider user={mkUser('operator')}>
        <UploadButton onClick={onClick} />
      </UserProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Subir lote' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
