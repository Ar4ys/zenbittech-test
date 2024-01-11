import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export type User = typeof users.$inferSelect;
export type UserInsert = Omit<typeof users.$inferInsert, 'id'>;
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('name').notNull().unique(),
  password: text('password').notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  movies: many(movies),
}));

export type Movie = typeof movies.$inferSelect;
export type MovieInsert = Omit<typeof movies.$inferInsert, 'id'>;
export const movies = pgTable('movies', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  publishingYear: integer('publishingYear').notNull(),
  ownerId: integer('ownerId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  imageId: integer('imageId')
    .notNull()
    .references(() => images.id),
});

export const moviesRelations = relations(movies, ({ one }) => ({
  owner: one(users, {
    fields: [movies.ownerId],
    references: [users.id],
  }),
  image: one(images, {
    fields: [movies.imageId],
    references: [images.id],
  }),
}));

export type Image = typeof images.$inferSelect;
export type ImageInsert = Omit<typeof images.$inferInsert, 'id'>;
export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  blurhash: text('blurhash').notNull(),
});

export const imagesRelations = relations(images, ({ one }) => ({
  movie: one(movies),
}));
