import { initContract } from '@ts-rest/core';

import { SessionExpiredError, UnauthorizedError } from '../errors';

export const c = initContract();

export const authErrors = [UnauthorizedError, SessionExpiredError] as const;
