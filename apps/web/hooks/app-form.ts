import { useCallback } from 'react';
import {
  FieldPath,
  FieldValues,
  SetValueConfig,
  UseFormHandleSubmit,
  useForm as useOriginalForm,
  UseFormProps as UseOriginalFormProps,
  UseFormReturn as UseOriginalFormReturn,
} from 'react-hook-form';

export type SetTouchedConfig = Omit<SetValueConfig, 'shouldTouch'>;

export type UseFormSetTouched<TFieldValues extends FieldValues> = <
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  name: TFieldName,
  options?: SetTouchedConfig,
) => void;

export interface UseFormProps<TFieldValues extends FieldValues = FieldValues, TContext = unknown>
  extends UseOriginalFormProps<TFieldValues, TContext> {
  // This is custom behaviour. `useForm` DOES NOT touch and validate forms on submit,
  // which is a super bad UX: user presses submit button and nothing happens,
  // instead of showing validation error.
  /**
   * By default fields are automatically touched and validated on submit. However you can disable
   * this behaviour by setting `shouldValidateOnSubmit` to false.
   *
   * @default true
   */
  shouldValidateOnSubmit?: boolean;
}

export interface UseFormReturn<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues | undefined = undefined,
> extends UseOriginalFormReturn<TFieldValues, TContext, TTransformedValues> {
  /**
   * This function allows you to dynamically touch a registered field and have the options to
   * validate and update the form state.
   */
  setTouched: UseFormSetTouched<TFieldValues>;
}

export function useAppForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues | undefined = undefined,
>({
  shouldValidateOnSubmit = true,
  mode = 'onTouched',
  ...props
}: UseFormProps<TFieldValues, TContext> = {}): UseFormReturn<
  TFieldValues,
  TContext,
  TTransformedValues
> {
  // `useOriginalForm` always returns the same object reference, so it is safe
  //  to use it as a useCallback dependency
  const form = useOriginalForm<TFieldValues, TContext, TTransformedValues>({
    mode,
    ...props,
  });

  const setTouched = useCallback<UseFormSetTouched<TFieldValues>>(
    (name, options = {}) => {
      const value = form.getValues(name);
      form.setValue(name, value, {
        ...options,
        shouldTouch: true,
      });
    },
    [form],
  );

  const handleSubmit = useCallback<UseFormHandleSubmit<TFieldValues, TTransformedValues>>(
    (...args) =>
      (...eventArgs) => {
        if (shouldValidateOnSubmit) {
          for (const key of Object.keys(form.getValues())) {
            setTouched(key as FieldPath<TFieldValues>);
          }
        }

        return form.handleSubmit(...args)(...eventArgs);
      },
    [setTouched, shouldValidateOnSubmit, form],
  );

  return {
    ...form,
    handleSubmit,
    setTouched,
  };
}
