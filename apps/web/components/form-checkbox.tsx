import { ChangeEventHandler, ReactElement, useCallback } from 'react';
import { Control, FieldPathByValue, FieldValues, PathValue, useController } from 'react-hook-form';

import { Checkbox, CheckboxProps } from './checkbox';

type AcceptedValue = string | number | boolean | AcceptedValue[] | null;
type ExtractArrayType<T> = T extends (infer K)[] ? K : T;

export type FormCheckboxProps<
  TFieldValues extends FieldValues,
  TPath extends FieldPathByValue<TFieldValues, AcceptedValue>,
> = Omit<
  CheckboxProps,
  'name' | 'value' | 'defaultValue' | 'touched' | 'error' | 'onBlur' | 'isChecked' | 'multiple'
> & {
  control: Control<TFieldValues>;
  name: TPath;
} & (
    | {
        multiple: true;
        value: ExtractArrayType<PathValue<TFieldValues, TPath>>;
      }
    | {
        multiple?: false;
        value?: ExtractArrayType<PathValue<TFieldValues, TPath>>;
      }
  );

export const FormCheckbox = <
  TFieldValues extends FieldValues,
  TPath extends FieldPathByValue<TFieldValues, AcceptedValue>,
>({
  name,
  control,
  value,
  multiple,
  ...props
}: FormCheckboxProps<TFieldValues, TPath>): ReactElement | null => {
  type FormValue = PathValue<TFieldValues, TPath>;
  type FieldValue = ExtractArrayType<FormValue>;
  const { field, fieldState } = useController({
    name,
    control,
  });

  const isChecked =
    // eslint-disable-next-line no-nested-ternary
    value === undefined
      ? Boolean(field.value)
      : multiple && Array.isArray(field.value)
        ? (field.value as FieldValue[]).includes(value)
        : field.value === value;

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(() => {
    if (multiple && Array.isArray(field.value)) {
      const newValue = isChecked
        ? (field.value as FieldValue[]).filter((item) => item !== value)
        : [...(field.value as FieldValue[]), value];
      field.onChange(newValue as FormValue);
    } else if (multiple) {
      field.onChange([value] as FormValue);
    } else if (value !== undefined) {
      field.onChange((isChecked ? null : value) as FormValue);
    } else {
      field.onChange(!isChecked as FormValue);
    }
  }, [field, isChecked, multiple, value]);

  return (
    <Checkbox
      {...props}
      {...field}
      value={value}
      onChange={handleChange}
      isChecked={isChecked}
      error={fieldState.isTouched && !!fieldState.error}
    />
  );
};
