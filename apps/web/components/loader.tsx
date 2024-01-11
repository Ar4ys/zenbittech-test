import { ComponentProps, FC } from 'react';

import { tw } from '@/utils';

export type LoaderProps = { wrapperClassName?: string } & ComponentProps<'div'>;

export const Loader: FC<LoaderProps> = ({ wrapperClassName, className, ...props }) => (
  <div className={tw('flex w-full justify-center', wrapperClassName)}>
    <div
      {...props}
      className={tw(
        'inline-block h-5 w-5 animate-spin rounded-full border-4 border-input border-t-primary',
        className,
      )}
    />
  </div>
);
