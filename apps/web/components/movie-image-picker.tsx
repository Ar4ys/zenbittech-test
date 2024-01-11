import { FC } from 'react';

import { FileDownloadIcon } from '@/icons';
import { tw } from '@/utils';

import { FileUploader } from './file-uploader';
import { Image } from './image';

type MovieImagePickerProps = {
  className?: string;
  file?: File | null;
  onUpload(file: File): void;
};

export const MovieImagePicker: FC<MovieImagePickerProps> = ({ className, file, onUpload }) => {
  return (
    <label
      className={tw(
        'bg-input relative flex cursor-pointer flex-col items-center justify-center rounded-[10px] border-2 border-dashed border-white',
        className,
      )}
    >
      {file && <Image src={file} className="absolute left-0 top-0 h-full w-full" />}
      <FileUploader accept="image/*" className="hidden" onUpload={onUpload} />
      <div className="bg-input justify relative z-10 flex flex-col items-center rounded-[10px] p-3">
        <FileDownloadIcon />
        <p className="text-body-small">Click to upload an image</p>
      </div>
    </label>
  );
};
