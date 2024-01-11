import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useAppForm } from '@/hooks';

type SignInInput = z.input<typeof signInSchema>;
type SignInOutput = z.output<typeof signInSchema>;

const defaultValues: SignInInput = {
  email: '',
  password: '',
  remember: false,
};

const signInSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
  remember: z.boolean(),
});

export const useSignInForm = () =>
  useAppForm<SignInInput, unknown, SignInOutput>({
    defaultValues: defaultValues,
    resolver: zodResolver(signInSchema),
  });
