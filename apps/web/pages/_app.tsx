import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { FC, ReactNode } from 'react';

import { ModalProvider } from '@/contexts/app-modal';

import '@/utils/zod-i18n';
import '@/styles/globals.css';

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  Layout?: FC<P & { children: ReactNode }>;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const Noop: FC<{ children: ReactNode }> = (props) => <>{props.children}</>;

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const Layout = Component.Layout ?? Noop;

  return (
    <ModalProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ModalProvider>
  );
}
