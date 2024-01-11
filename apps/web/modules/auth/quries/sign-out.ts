import { useMutation } from '@tanstack/react-query';
import { ClientInferRequest, ClientInferResponses } from '@ts-rest/core';
import { useRouter } from 'next/router';

import { contract } from '@repo/shared/contracts';

import { useAppModal, useSessionStore } from '@/contexts';
import { api } from '@/utils';

type SuccessResponse = Extract<ClientInferResponses<typeof contract.auth.signOut>, { status: 200 }>;
type ErrorResponse = Exclude<ClientInferResponses<typeof contract.auth.signOut>, { status: 200 }>;
type Values = ClientInferRequest<typeof contract.auth.signOut>;

export const useSignOut = () => {
  const router = useRouter();
  const { removeUserId } = useSessionStore();
  const { openInfoModal } = useAppModal();

  return useMutation<SuccessResponse, ErrorResponse, Values>({
    async mutationFn(params) {
      const result = await api.auth.signOut(params);
      if (result.status === 200) return result;
      throw result;
    },
    onSuccess() {
      removeUserId();
      router.push('/login');
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
