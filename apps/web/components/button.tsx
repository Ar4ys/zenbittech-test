import { ComponentProps, forwardRef } from 'react';

import { tw } from '@/utils';

import { Loader } from './loader';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  loaderClassName?: string;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      onClick,
      loading,
      disabled,
      children,
      variant = 'primary',
      type = 'button',
      loaderClassName,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        type={type}
        ref={ref}
        onClick={onClick}
        disabled={loading || disabled}
        className={tw(
          'rounded-[10px] px-7 py-4',
          {
            primary: 'bg-primary',
            secondary: 'border border-white bg-transparent',
            danger: 'bg-error',
          }[variant],
          className,
        )}
        {...props}
      >
        {loading ? <Loader className={tw('m-auto', loaderClassName)} /> : children}
      </button>
    );
  },
);

Button.displayName = 'Button';
