import { FC } from 'react';

import { tw } from '@/utils';

export type FormErrorType = string | false | null;

export type FormErrorProps = {
  className?: string;
  errorText?: FormErrorType;
};

export const FormError: FC<FormErrorProps> = ({ className, errorText }) => (
  <p className={tw('text-error text-body-extra-small', className)}>{errorText || ' '}</p>
);
