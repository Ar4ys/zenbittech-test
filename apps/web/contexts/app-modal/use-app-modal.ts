import { useContext } from 'react';

import { ModalContext } from './app-modal';

export const useAppModal = () => {
  return useContext(ModalContext);
};
