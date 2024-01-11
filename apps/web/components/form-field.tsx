import { ReactElement } from 'react';
import { Control, FieldPathByValue, FieldValues, PathValue, useController } from 'react-hook-form';

import { Field, FieldProps } from './field';

export type FormFieldProps<
  TFieldValues extends FieldValues,
  TPath extends FieldPathByValue<TFieldValues, string | number>,
> = Omit<FieldProps, 'value' | 'defaultValue' | 'error' | 'onBlur' | 'onChange'> & {
  control: Control<TFieldValues>;
  name: TPath;
  defaultValue?: PathValue<TFieldValues, TPath>;
};

export const FormField = <
  TFieldValues extends FieldValues,
  TPath extends FieldPathByValue<TFieldValues, string | number>,
>({
  name,
  defaultValue,
  control,
  ...props
}: FormFieldProps<TFieldValues, TPath>): ReactElement | null => {
  const { field, fieldState } = useController({
    name,
    control,
    defaultValue,
  });

  return (
    <Field
      {...props}
      {...field}
      error={fieldState.isTouched && (fieldState.error?.message ?? fieldState.error?.type)}
    />
  );
};
