import { ChangeEventHandler, FC, FocusEventHandler } from 'react';

import { tw } from '@/utils';

export type CheckboxProps = {
  className?: string;
  name?: string;
  label?: string;
  multiple?: boolean;
  isChecked: boolean;
  value?: string;
  error?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
};

export const Checkbox: FC<CheckboxProps> = ({
  className,
  label,
  onChange,
  onBlur,
  isChecked,
  multiple = false,
  value,
  error,
  name,
}) => {
  return (
    <>
      <label className={tw('flex cursor-pointer gap-2', className)}>
        <input
          name={name}
          className="hidden"
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          multiple={multiple}
        />
        <span
          className={tw(
            'relative transition-all delay-100 ease-in-out  before:transition-all before:delay-100 before:ease-in-out  after:transition-all after:delay-100 after:ease-in-out',
            'before:bg-input before:flex before:h-4 before:w-4 before:rounded-[5px]',
            'after:absolute after:left-1 after:top-1.5 after:block after:h-1 after:w-2 after:-rotate-45 after:border-b after:border-l after:border-white after:bg-transparent after:opacity-0',
            isChecked && 'after:opacity-100',
            !!error && 'border-error border',
          )}
        ></span>
        <span className="text-body-small">{label}</span>
      </label>
    </>
  );
};
