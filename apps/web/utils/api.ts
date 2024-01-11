import { initClient } from '@ts-rest/core';
import { GetServerSidePropsContext } from 'next';

import { contract } from '@repo/shared/contracts';

export const api = initClient(contract, {
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  baseHeaders: {},
});

export async function getSession(
  ctx: GetServerSidePropsContext,
): Promise<{ userId: number } | undefined> {
  const requestCookieString = Object.entries(ctx.req.cookies).reduce(
    (str, [name, value]) => str + `${name}=${value}; `,
    '',
  );

  const res = await api.auth.me({
    extraHeaders: {
      Cookie: requestCookieString,
    },
  });

  const responseCookie = res.headers.getSetCookie();
  ctx.res.setHeader('Set-Cookie', responseCookie);

  if (res.status === 200) return res.body;
  return undefined;
}
