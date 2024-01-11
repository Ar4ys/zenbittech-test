import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ClientInferResponses } from '@ts-rest/core';

import { contract } from '@repo/shared/contracts';

import { api } from '@/utils';

import { moviesQueryKeys } from '..';

type SuccessResponse = Extract<
  ClientInferResponses<typeof contract.movie.getPaginated>,
  { status: 200 }
>;
type ErrorResponse = Exclude<
  ClientInferResponses<typeof contract.movie.getPaginated>,
  { status: 200 }
>;

export const getPaginatedMovies = async (page: number) => {
  const result = await api.movie.getPaginated({ query: { page } });
  if (result.status === 200) return result;
  throw result;
};

export const useGetPaginatedMovies = (page: number) => {
  return useQuery<SuccessResponse, ErrorResponse>({
    queryKey: moviesQueryKeys.paginatedMovies(page).queryKey,
    queryFn: () => getPaginatedMovies(page),
    placeholderData: keepPreviousData,
  });
};
