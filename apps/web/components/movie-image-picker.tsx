import { FC } from 'react';

import { FileDownloadIcon } from '@/icons';
import { tw } from '@/utils';

import { FileUploader } from './file-uploader';

type MovieImagePickerProps = {
  className?: string;
  onUpload(file: File): void;
};

export const MovieImagePicker: FC<MovieImagePickerProps> = ({ className, onUpload }) => {
  return (
    <label
      className={tw(
        'bg-input flex cursor-pointer flex-col items-center justify-center rounded-[10px] border-2 border-dashed border-white',
        className,
      )}
    >
      <FileUploader accept="image/*" className="hidden" onUpload={onUpload} />
      <FileDownloadIcon />
      <p className="text-body-small">Click to upload an image</p>
    </label>
  );
};
