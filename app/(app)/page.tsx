import { getCurrentUser } from '@/lib/auth/session';
import { LogoutButton } from '@/components/auth/logout-button';
import { logoutAction } from './logout/actions';

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Hola, {user?.full_name ?? 'invitado'}</h1>
        <p className="text-sm text-muted-foreground">
          Próximo: layout autenticado con sidebar y navegación (Slice 1).
        </p>
        <LogoutButton action={logoutAction} />
      </div>
    </main>
  );
}
