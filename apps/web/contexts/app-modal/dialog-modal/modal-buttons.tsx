import { FC, Fragment } from 'react';

import { Button, ButtonVariant } from '@/components';
import { tw } from '@/utils';

export interface DialogModalButtonProps {
  buttonText: string;
  onPress: () => void;
}

export type ModalButtonProps = DialogModalButtonProps & {
  variant?: ButtonVariant;
  className?: string;
};

const ModalButton: FC<ModalButtonProps> = ({ onPress, buttonText, variant, className }) => {
  return (
    <Button
      variant={variant}
      className={tw('text-body-regular w-full text-center text-white', className)}
      onClick={onPress}
    >
      {buttonText}
    </Button>
  );
};

export type ModalButtonsProps = {
  answers: DialogModalButtonProps[];
};

export const ModalButtons: FC<ModalButtonsProps> = ({ answers }) => {
  switch (answers?.length) {
    case 1:
      return (
        <div className="flex w-full justify-center">
          <ModalButton className="px-5" {...answers[0]} />
        </div>
      );
    case 2:
      return (
        <div className="flex w-full items-center justify-around">
          <ModalButton className="w-1/2" variant="secondary" {...answers[0]} />
          <ModalButton className="w-1/2" {...answers[1]} />
        </div>
      );

    default:
      return (
        <>
          {answers?.map(({ buttonText, onPress }, i) => {
            return (
              <Fragment key={String(buttonText + i)}>
                <ModalButton
                  variant={i < 1 ? 'secondary' : 'primary'}
                  buttonText={buttonText}
                  onPress={onPress}
                />
              </Fragment>
            );
          })}
        </>
      );
  }
};
