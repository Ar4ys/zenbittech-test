import { useMutation } from '@tanstack/react-query';
import { ClientInferRequest, ClientInferResponses } from '@ts-rest/core';
import { useRouter } from 'next/router';

import { contract } from '@repo/shared/contracts';

import { useAppModal, useSessionStore } from '@/contexts';
import { api } from '@/utils';

type SuccessResponse = Extract<ClientInferResponses<typeof contract.auth.signIn>, { status: 200 }>;
type ErrorResponse = Exclude<ClientInferResponses<typeof contract.auth.signIn>, { status: 200 }>;
type Values = ClientInferRequest<typeof contract.auth.signIn>;

export const useSignIn = () => {
  const router = useRouter();
  const { setUserId } = useSessionStore();
  const { openInfoModal } = useAppModal();

  return useMutation<SuccessResponse, ErrorResponse, Values>({
    async mutationFn(params) {
      const result = await api.auth.signIn(params);
      if (result.status === 200) return result;
      throw result;
    },
    onSuccess(data) {
      setUserId(data.body.id);
      router.push('/movies');
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
