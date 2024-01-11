import { initClient } from '@ts-rest/core';

import { contract } from '@repo/shared/contracts';

export const api = initClient(contract, {
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  baseHeaders: {},
});
