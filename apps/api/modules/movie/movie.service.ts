import { Injectable } from '@nestjs/common';
import { count, eq } from 'drizzle-orm';

import { AppDb, Image, Movie, MovieInsert, movies } from '@/db';

import { DbService } from '../db';
import { MOVIE_PAGE_SIZE } from './movie.const';

@Injectable()
export class MovieService {
  private readonly db: AppDb;

  constructor(private dbService: DbService) {
    this.db = this.dbService.db;
  }

  async findById(id: number): Promise<Movie | undefined> {
    return this.db.query.movies.findFirst({
      where: eq(movies.id, id),
    });
  }

  async findMovieWithImage(id: number): Promise<(Movie & { image: Image }) | undefined> {
    return await this.db.query.movies.findFirst({
      where: eq(movies.id, id),
      with: {
        image: true,
      },
    });
  }

  async findPaginatedByUserId(userId: number, page: number = 0) {
    const [{ value: moviesCount }] = await this.db
      .select({ value: count() })
      .from(movies)
      .where(eq(movies.ownerId, userId));

    const totalPages = Math.ceil(moviesCount / MOVIE_PAGE_SIZE);

    const movieList = await this.db.query.movies.findMany({
      with: { image: true },
      where: eq(movies.ownerId, userId),
      offset: page * MOVIE_PAGE_SIZE,
      limit: MOVIE_PAGE_SIZE,
      orderBy: movies.id,
    });

    return { totalPages, movieList };
  }

  async createMovie(data: MovieInsert): Promise<Movie> {
    const [movie] = await this.db.insert(movies).values(data).returning();
    return movie;
  }

  async updateMovie(id: number, data: Partial<MovieInsert>): Promise<Movie | undefined> {
    const [movie] = await this.db.update(movies).set(data).where(eq(movies.id, id)).returning();
    // Movies with such id may not be found. In that case `movie` will be undefined
    return movie as typeof movie | undefined;
  }

  async deleteMovie(id: number): Promise<void> {
    await this.db.delete(movies).where(eq(movies.id, id));
  }
}
