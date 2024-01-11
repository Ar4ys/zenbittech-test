import path from 'path';

import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

import { environmentValidator, getEnvironmentFilePath } from './environment';

for (const envFile of getEnvironmentFilePath()) {
  dotenv.config({ path: path.resolve(__dirname, envFile) });
}

const env = environmentValidator(process.env);

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  driver: 'pg',
  dbCredentials: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
  },
} satisfies Config;
