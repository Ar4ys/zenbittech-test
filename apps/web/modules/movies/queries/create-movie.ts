import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClientInferRequest, ClientInferResponses } from '@ts-rest/core';
import { useRouter } from 'next/router';

import { contract } from '@repo/shared/contracts';

import { useAppModal } from '@/contexts';
import { api } from '@/utils';

import { moviesQueryKeys } from '..';

type SuccessResponse = Extract<ClientInferResponses<typeof contract.movie.create>, { status: 201 }>;
type ErrorResponse = Exclude<ClientInferResponses<typeof contract.movie.create>, { status: 201 }>;
type Values = ClientInferRequest<typeof contract.movie.create>;

export const useCreateMovie = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { openInfoModal } = useAppModal();

  return useMutation<SuccessResponse, ErrorResponse, Values>({
    async mutationFn(params) {
      const result = await api.movie.create(params);
      if (result.status === 201) return result;
      throw result;
    },
    async onSuccess() {
      router.back();
      await queryClient.invalidateQueries({ queryKey: moviesQueryKeys.paginatedMovies._def });
    },
    onError(error) {
      openInfoModal({
        title: 'Error',
        text: error.body.message,
        confirmText: 'Ok',
      });
    },
  });
};
