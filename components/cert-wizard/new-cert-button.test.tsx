import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NewCertButton } from './new-cert-button';
import { UserProvider } from '@/lib/auth/user-context';
import type { MeUser } from '@/lib/api/me';

const operator: MeUser = {
  id: 'u-1',
  email: 'op@x.com',
  full_name: 'Op',
  role: 'operator',
  is_active: true,
};
const auditor: MeUser = { ...operator, role: 'auditor' };

describe('<NewCertButton />', () => {
  it('renders for operator and calls onClick', () => {
    const onClick = vi.fn();
    render(
      <UserProvider user={operator}>
        <NewCertButton onClick={onClick} />
      </UserProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: /nuevo certificado/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does NOT render for auditor (no certificate.simulate permission)', () => {
    render(
      <UserProvider user={auditor}>
        <NewCertButton onClick={vi.fn()} />
      </UserProvider>,
    );
    expect(screen.queryByRole('button', { name: /nuevo certificado/i })).not.toBeInTheDocument();
  });
});
