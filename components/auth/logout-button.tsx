'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';

export type LogoutAction = () => Promise<void>;

export function LogoutButton({ action }: { action: LogoutAction }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button variant="outline" onClick={() => startTransition(() => action())} disabled={pending}>
      {pending ? 'Cerrando…' : 'Cerrar sesión'}
    </Button>
  );
}
