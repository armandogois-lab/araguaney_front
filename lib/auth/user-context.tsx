'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { MeUser } from '@/lib/api/me';

const UserContext = createContext<MeUser | null>(null);

export function UserProvider({ user, children }: { user: MeUser; children: ReactNode }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser(): MeUser {
  const u = useContext(UserContext);
  if (!u) throw new Error('useUser must be called inside <UserProvider>');
  return u;
}
