import { ChangeEventHandler, FC, MouseEventHandler, useCallback } from 'react';

export type FileUploaderProps = {
  id?: string;
  className?: string;
  accept?: string;
} & (
  | {
      onUpload: (files: File[]) => void;
      multiple: true;
    }
  | {
      onUpload: (file: File) => void;
      multiple?: false;
    }
);

export const FileUploader: FC<FileUploaderProps> = ({ onUpload, multiple, ...props }) => {
  const handleUploadPicture = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      if (!event?.target?.files?.length) return;
      if (multiple) {
        const files: File[] = Array.from(event.target.files);
        onUpload(files);
      } else {
        const file = event.target.files[0];
        onUpload(file);
      }
    },
    [onUpload, multiple],
  );

  const onClickHandler = useCallback<MouseEventHandler<HTMLInputElement>>((event) => {
    // eslint-disable-next-line no-param-reassign
    if (event.target instanceof HTMLInputElement) event.target.value = '';
  }, []);

  return <input {...props} type="file" onChange={handleUploadPicture} onClick={onClickHandler} />;
};
