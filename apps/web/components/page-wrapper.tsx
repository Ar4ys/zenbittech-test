import { FC, ReactNode } from 'react';

export type PageWrapperProps = {
  left?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
};

export const PageWrapper: FC<PageWrapperProps> = ({ left, right, children }) => {
  return (
    <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col items-center gap-20 px-6 py-20 md:gap-[120px] md:pt-[120px]">
      <div className="flex w-full justify-between">
        {left ?? <div />}
        {right ?? <div />}
      </div>
      {children}
    </div>
  );
};
