'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/page-header';
import { listUsers } from '@/lib/api/users';
import type { AppUser } from '@/lib/types/user';
import type { MeUser } from '@/lib/api/me';
import { UsersToolbar, type UsersFiltersValue } from './users-toolbar';
import { UserRow } from './user-row';
import { UserRoleModal } from './user-role-modal';
import { UserActiveModal } from './user-active-modal';

interface Props {
  me: MeUser;
}

const INITIAL_FILTERS: UsersFiltersValue = {
  q: '',
  role: 'all',
  is_active: 'all',
};

export function UsersPage({ me }: Props) {
  const [filters, setFilters] = useState<UsersFiltersValue>(INITIAL_FILTERS);
  const [roleTarget, setRoleTarget] = useState<AppUser | null>(null);
  const [activeTarget, setActiveTarget] = useState<AppUser | null>(null);

  const apiQuery = {
    q: filters.q || undefined,
    role: filters.role === 'all' ? undefined : filters.role,
    is_active: filters.is_active === 'all' ? undefined : filters.is_active === 'active',
  } as const;

  const usersQ = useQuery({
    queryKey: ['users', apiQuery],
    queryFn: () => listUsers(apiQuery),
    staleTime: 30_000,
  });

  return (
    <div className="mx-auto w-full max-w-[1440px] px-9 py-7">
      <PageHeader breadcrumb={{ section: 'Sistema', current: 'Usuarios' }} title="Usuarios" />
      <div className="mt-5 flex flex-col gap-4">
        <UsersToolbar value={filters} onChange={setFilters} />
        <div className="bg-card border-border-subtle overflow-hidden rounded-xl border">
          <div className="text-text-3 border-border-subtle grid border-b px-5 py-2 text-[10px] uppercase tracking-wide grid-cols-[1.4fr_1fr_120px_120px_120px_120px]">
            <span>Usuario</span>
            <span>Rol</span>
            <span>Estado</span>
            <span>Último login</span>
            <span>Creado</span>
            <span />
          </div>
          {usersQ.isLoading && (
            <div className="text-text-3 px-5 py-6 text-center text-[12px]">Cargando usuarios…</div>
          )}
          {usersQ.isError && (
            <div className="text-warn-text px-5 py-6 text-center text-[12px]">
              No se pudieron cargar los usuarios.
            </div>
          )}
          {usersQ.data && usersQ.data.data.length === 0 && (
            <div className="text-text-3 px-5 py-6 text-center text-[12px] italic">
              Sin usuarios que coincidan.
            </div>
          )}
          {usersQ.data?.data.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              isSelf={u.id === me.id}
              onEditRole={setRoleTarget}
              onToggleActive={setActiveTarget}
            />
          ))}
        </div>
      </div>
      {roleTarget && <UserRoleModal target={roleTarget} onClose={() => setRoleTarget(null)} />}
      {activeTarget && (
        <UserActiveModal target={activeTarget} onClose={() => setActiveTarget(null)} />
      )}
    </div>
  );
}
