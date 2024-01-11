import path from 'path';

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { Sql } from 'postgres';

import * as schema from './schema';

export type AppDb = ReturnType<typeof createDb>;
export const createDb = (client: Sql) => drizzle(client, { schema });
export const runMigrations = (db: AppDb) =>
  migrate(db, { migrationsFolder: path.resolve(__dirname, './migrations') });
