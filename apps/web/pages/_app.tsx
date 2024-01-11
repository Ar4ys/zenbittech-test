import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { FC, ReactNode, useState } from 'react';

import { ModalProvider } from '@/contexts/app-modal';

import '@/utils/zod-i18n';
import '@/styles/globals.css';

import { SessionStoreProvider } from '@/contexts';

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  Layout?: FC<P & { children: ReactNode }>;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const Noop: FC<{ children: ReactNode }> = (props) => <>{props.children}</>;

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      }),
  );
  const Layout = Component.Layout ?? Noop;

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <SessionStoreProvider userId={pageProps.sessionUserId}>
          <ModalProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ModalProvider>
        </SessionStoreProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
