'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from '@/components/ui/form';

const FormSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
});

type FormValues = z.infer<typeof FormSchema>;

export type LoginFormAction = (formData: FormData) => Promise<{ error: string | null }>;

interface LoginFormProps {
  action: LoginFormAction;
}

/**
 * Thin wrapper that grabs formItemId from context and passes it as `id`
 * directly to the Input, so the FormLabel's htmlFor resolves to the input
 * element (not the FormControl div). This makes getByLabelText work in tests
 * and is semantically correct for accessibility.
 */
function LabeledInput(props: React.ComponentProps<'input'>) {
  const { formItemId, error, formDescriptionId, formMessageId } = useFormField();
  return (
    <Input
      id={formItemId}
      aria-describedby={!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
}

export function LoginForm({ action }: LoginFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<FormValues>({
    resolver: standardSchemaResolver(FormSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    setPending(true);
    const fd = new FormData();
    fd.set('email', values.email);
    fd.set('password', values.password);
    try {
      const result = await action(fd);
      if (result.error) setServerError(result.error);
    } finally {
      setPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo</FormLabel>
              <LabeledInput
                type="email"
                autoComplete="email"
                placeholder="operador@cashea.app"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <LabeledInput type="password" autoComplete="current-password" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        {serverError && (
          <p className="text-sm text-destructive" role="alert">
            {serverError}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? 'Ingresando…' : 'Ingresar'}
        </Button>
      </form>
    </Form>
  );
}
