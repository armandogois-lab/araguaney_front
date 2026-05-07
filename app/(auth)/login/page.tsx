import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loginAction } from './actions';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Cashea CFB</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm action={loginAction} />
        </CardContent>
      </Card>
    </main>
  );
}
