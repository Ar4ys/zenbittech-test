import { FC, ReactNode } from 'react';

import { ModalButtons, ModalButtonsProps } from './modal-buttons';

export type DefaultDialogModalProps = Partial<ModalButtonsProps> & {
  header: ReactNode;
  body?: ReactNode;
};

export const DefaultDialogModal: FC<DefaultDialogModalProps> = ({ header, answers, body }) => {
  return (
    <div className="mx-auto flex max-w-[80%] flex-col justify-center self-center rounded-xl bg-white-1000 px-6 py-5 default:min-h-[30%] desktop:min-h-[150px] desktop:max-w-[500px] mobile:min-w-[80%]">
      <div className="items-center">
        <div>{header}</div>
        <div className="pt-1.5">{body}</div>
      </div>
      {answers && (
        <div className="flex items-center justify-center desktop:mt-5">
          <ModalButtons answers={answers} />
        </div>
      )}
    </div>
  );
};
