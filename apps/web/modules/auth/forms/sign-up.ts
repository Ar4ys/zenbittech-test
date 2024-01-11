import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useAppForm } from '@/hooks';

type SignUpInput = z.input<typeof signUpSchema>;
type SignUpOutput = z.output<typeof signUpSchema>;

const defaultValues: SignUpInput = {
  email: '',
  password: '',
  remember: false,
};

const signUpSchema = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(6).max(255),
  remember: z.boolean(),
});

export const useSignUpForm = () =>
  useAppForm<SignUpInput, unknown, SignUpOutput>({
    defaultValues: defaultValues,
    resolver: zodResolver(signUpSchema),
  });
