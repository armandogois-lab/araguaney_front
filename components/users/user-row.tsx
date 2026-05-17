'use client';

import { fmtDate } from '@/lib/format/date';
import { Pill } from '@/components/ui/pill';
import type { AppUser } from '@/lib/types/user';
import { RolePill } from './role-pill';

interface Props {
  user: AppUser;
  isSelf: boolean;
  onEditRole: (u: AppUser) => void;
  onToggleActive: (u: AppUser) => void;
}

export function UserRow({ user, isSelf, onEditRole, onToggleActive }: Props) {
  const lastLogin = user.last_login_at ? fmtDate(user.last_login_at) : 'Nunca';
  const created = fmtDate(user.created_at);
  const containerClasses =
    'grid items-center gap-4 px-5 py-3.5 grid-cols-[1.4fr_1fr_120px_120px_120px_120px] ' +
    (isSelf ? 'opacity-50 pointer-events-none' : 'hover:bg-subtle');

  return (
    <div
      className={containerClasses}
      title={isSelf ? 'No podés editarte a vos mismo' : undefined}
    >
      <div>
        <div className="text-[12.5px] font-medium">{user.full_name}</div>
        <div className="text-text-3 text-[11px]">{user.email}</div>
      </div>
      <button
        type="button"
        onClick={() => !isSelf && onEditRole(user)}
        className="justify-self-start rounded-md text-left"
        aria-label={`Cambiar rol de ${user.full_name}`}
        disabled={isSelf}
      >
        <RolePill role={user.role} />
      </button>
      <div>
        {user.is_active ? (
          <button
            type="button"
            onClick={() => !isSelf && onToggleActive(user)}
            aria-label={`Desactivar ${user.full_name}`}
            disabled={isSelf}
          >
            <Pill variant="success">Activo</Pill>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => !isSelf && onToggleActive(user)}
            aria-label={`Activar ${user.full_name}`}
            disabled={isSelf}
          >
            <Pill variant="neutral">Inactivo</Pill>
          </button>
        )}
      </div>
      <div className="text-text-3 text-[11px] tabular-nums">{lastLogin}</div>
      <div className="text-text-3 text-[11px] tabular-nums">{created}</div>
    </div>
  );
}
