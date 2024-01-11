import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useAppForm } from '@/hooks';
import { formI18n } from '@/utils';

type CreateMovieInput = z.input<typeof createMovieSchema>;
type CreateMovieOutput = z.output<typeof createMovieSchema>;

const defaultValues: CreateMovieInput = {
  image: null,
  title: '',
  publishingYear: '',
};

const createMovieSchema = z.object({
  image: z
    .instanceof(File)
    .nullable()
    .refine((value): value is NonNullable<typeof value> => value != null, formI18n.required),
  title: z.string().min(3),
  publishingYear: z.string().pipe(z.coerce.number().min(1800)),
});

export const useCreateMovieForm = () =>
  useAppForm<CreateMovieInput, unknown, CreateMovieOutput>({
    defaultValues: defaultValues,
    resolver: zodResolver(createMovieSchema),
  });
