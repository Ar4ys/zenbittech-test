import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export type User = typeof users.$inferSelect;
export type UserInsert = Omit<typeof users.$inferInsert, 'id'>;
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('name').notNull().unique(),
  password: text('password').notNull(),
});
