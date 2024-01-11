import { createQueryKeys } from '@lukemorales/query-key-factory';

export const moviesQueryKeys = createQueryKeys('movies', {
  paginatedMovies: (page: number) => [page],
});
