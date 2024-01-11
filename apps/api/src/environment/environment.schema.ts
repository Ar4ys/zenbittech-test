import { z } from 'nestjs-zod/z';

import { NodeEnv } from './environment.enum';

export type Environment = z.infer<typeof environmentSchema>;

const portScheme = z.coerce.number().positive().max(65535);

export const environmentSchema = z.object({
  NODE_ENV: z.nativeEnum(NodeEnv),
  API_PORT: portScheme.default(3000),
  FRONTEND_URL: z
    .string()
    .url()
    .transform((url) => (url.endsWith('/') ? url.slice(0, -1) : url)),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: portScheme.default(5432),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string().default('postgres'),
  PASSWORD_SALT_ROUNDS: z.coerce.number().min(6).default(12),
  JWT_SECRET: z.string(),
});
