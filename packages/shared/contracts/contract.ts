import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { SessionExpiredError, UnauthorizedError } from '../errors';

export const c = initContract();

export const authGuardSchema = z.union([
  UnauthorizedError.zodSchema,
  SessionExpiredError.zodSchema,
]);
