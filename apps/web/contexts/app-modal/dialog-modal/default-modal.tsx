import { FC, ReactNode } from 'react';

import { ModalButtons, ModalButtonsProps } from './modal-buttons';

export type DefaultDialogModalProps = Partial<ModalButtonsProps> & {
  header: ReactNode;
  body?: ReactNode;
};

export const DefaultDialogModal: FC<DefaultDialogModalProps> = ({ header, answers, body }) => {
  return (
    <div className="bg-background mx-auto flex h-fit min-w-[80%] max-w-[80%] flex-col justify-center gap-6 self-center rounded-xl px-6 py-5 sm:min-h-[150px] sm:max-w-[500px]">
      <div className="flex flex-col items-center gap-4">
        <div>{header}</div>
        <div>{body}</div>
      </div>
      {answers && (
        <div className="flex items-center justify-center sm:mt-5">
          <ModalButtons answers={answers} />
        </div>
      )}
    </div>
  );
};
