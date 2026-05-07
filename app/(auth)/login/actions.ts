'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { signIn } from '@/lib/auth/supabase';
import { setSessionCookie } from '@/lib/auth/cookie';

const Input = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function loginAction(formData: FormData): Promise<{ error: string | null }> {
  const parsed = Input.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: 'Correo o contraseña inválidos' };
  }

  const result = await signIn(parsed.data.email, parsed.data.password);
  if (!result.ok) {
    return { error: result.error };
  }

  await setSessionCookie(result.accessToken);
  redirect('/');
}
