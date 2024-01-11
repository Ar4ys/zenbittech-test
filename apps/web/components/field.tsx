import {
  ChangeEventHandler,
  ComponentProps,
  FocusEventHandler,
  forwardRef,
  ReactElement,
} from 'react';

import { tw } from '@/utils';

import { FormError, FormErrorType } from './form-error';

/** @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete */
export type Autocomplete =
  | 'off'
  | 'on'
  | 'name'
  | 'given-name'
  | 'family-name'
  | 'additional-name'
  | 'nickname'
  | 'email'
  | 'username'
  | 'new-password'
  | 'current-password'
  | 'one-time-code'
  | 'street-address'
  | 'language'
  | 'sex'
  | 'url'
  | 'photo'
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {});

export type FieldProps = {
  name?: string;
  label?: string;
  value: string;
  error?: FormErrorType;
  inputMode?: ComponentProps<'input'>['inputMode'];
  type?: ComponentProps<'input'>['type'];
  placeholder?: string;
  autoComplete?: Autocomplete;
  inputClassName?: string;
  className?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
};

export const Field = forwardRef<HTMLInputElement, FieldProps>(
  (
    {
      name,
      label,
      className,
      inputClassName,
      value,
      error,
      type,
      inputMode,
      placeholder = '',
      autoComplete,
      onChange,
      onBlur,
    },
    ref,
  ): ReactElement | null => {
    return (
      <div className={tw('flex max-w-full flex-col gap-2', className)}>
        {label && (
          <p className={tw('text-body-extra-small', error ? 'text-error' : 'text-input')}>
            {label}
          </p>
        )}
        <input
          ref={ref}
          className={tw(
            'bg-input w-full rounded-[10px] px-4 py-3',
            !!error && 'border-error text-error border',
            inputClassName,
          )}
          name={name}
          autoComplete={autoComplete}
          placeholder={placeholder}
          inputMode={inputMode}
          // eslint-disable-next-line no-nested-ternary
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
        <FormError className="w-full" errorText={error} />
      </div>
    );
  },
);

Field.displayName = 'Field';
