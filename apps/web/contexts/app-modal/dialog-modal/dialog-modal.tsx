import { FC, ReactNode } from 'react';

import { tw } from '@/utils';

export type DialogModalProps = {
  children: ReactNode;
  className?: string;
};

export const DialogModal: FC<DialogModalProps> = ({ children, className }) => {
  return (
    <div
      className={tw('bg-black-1000/20 fixed left-0 top-0 z-[2000] flex h-full w-full', className)}
    >
      {children}
    </div>
  );
};
