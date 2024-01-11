import { Head, Html, Main, NextScript } from 'next/document';

import { BgWavesIcon } from '@/icons';

export default function Document() {
  return (
    <Html lang="en" className="flex min-h-full flex-col">
      <Head />
      <body className="bg-background relative flex w-full grow flex-col pb-[111px] text-white">
        <BgWavesIcon className="absolute bottom-0 h-[111px] w-full" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
