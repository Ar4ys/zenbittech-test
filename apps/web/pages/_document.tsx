import { Head, Html, Main, NextScript } from 'next/document';

import { BgWavesIcon } from '@/icons';

export default function Document() {
  return (
    <Html lang="en" className="h-full w-full">
      <Head />
      <body className="bg-background h-full w-full text-white">
        <BgWavesIcon className="absolute bottom-0 h-[111px] w-full" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
