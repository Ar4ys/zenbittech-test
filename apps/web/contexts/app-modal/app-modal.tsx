import {
  createContext,
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

import { DefaultDialogModal, DialogModal, DialogModalProps } from './dialog-modal';

export type OpenConfirmationModalProps = {
  className?: string;
  title: string;
  text?: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export interface OpenModalProps {
  className?: string;
  children: ReactNode;
}

export type OpenInfoModalProps = {
  className?: string;
  title: string;
  text?: string;
  confirmText: string;
  onConfirm?: () => void;
};

export interface ModalContextProps {
  closeModal: () => void;
  openModal: (props: OpenModalProps) => void;
  openConfirmationModal: (props: OpenConfirmationModalProps) => void;
  openInfoModal: (props: OpenInfoModalProps) => void;
}

export const ModalContext = createContext<ModalContextProps>({
  /* eslint-disable @typescript-eslint/no-empty-function */
  closeModal: () => {},
  openModal: () => {},
  openConfirmationModal: () => {},
  openInfoModal: () => {},
  /* eslint-enable @typescript-eslint/no-empty-function */
});

// eslint-disable-next-line react/display-name
export const ModalProvider = forwardRef<ModalContextProps, { children: ReactNode }>(
  ({ children }, ref) => {
    const [currentModal, setCurrentModal] = useState<DialogModalProps | undefined>();

    const closeModal = useCallback(() => {
      setCurrentModal(undefined);
    }, [setCurrentModal]);

    const openModal = useCallback(({ children: modalBody, className }: OpenModalProps) => {
      setCurrentModal({
        children: modalBody,
        className,
      });
    }, []);

    const openConfirmationModal = useCallback(
      ({
        title,
        text,
        confirmText,
        cancelText,
        onConfirm,
        onCancel,
        className,
      }: OpenConfirmationModalProps) => {
        return openModal({
          className,
          children: (
            <DefaultDialogModal
              header={<p className="text-h3 text-center">{title}</p>}
              body={<p className="text-caption text-center text-white">{text}</p>}
              answers={[
                {
                  buttonText: cancelText,
                  onPress: () => {
                    onCancel?.();
                    closeModal();
                  },
                },
                {
                  buttonText: confirmText,
                  onPress: () => {
                    onConfirm();
                    closeModal();
                  },
                },
              ]}
            />
          ),
        });
      },
      [openModal, closeModal],
    );

    const openInfoModal = useCallback(
      ({ title, text, confirmText, onConfirm }: OpenInfoModalProps) => {
        return openModal({
          children: (
            <DefaultDialogModal
              header={<p className="text-h3 text-center">{title}</p>}
              body={<p className="text-caption text-center text-white">{text}</p>}
              answers={[
                {
                  buttonText: confirmText,
                  onPress: () => {
                    onConfirm?.();
                    closeModal();
                  },
                },
              ]}
            />
          ),
        });
      },
      [openModal, closeModal],
    );

    const contextState: ModalContextProps = useMemo(
      () => ({
        closeModal,
        openModal,
        openConfirmationModal,
        openInfoModal,
      }),
      [closeModal, openConfirmationModal, openInfoModal, openModal],
    );

    useImperativeHandle(ref, () => contextState, [contextState]);

    return (
      <ModalContext.Provider value={contextState}>
        {children}
        {currentModal && (
          <DialogModal className={currentModal.className}>{currentModal.children}</DialogModal>
        )}
      </ModalContext.Provider>
    );
  },
);
