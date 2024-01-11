import { z } from 'zod';

import { HttpStatus } from '../constants';
import { BadRequestError, UnauthorizedError } from '../errors';
import { auth } from './auth';
import { authGuardSchema, c } from './contract';
import { movie } from './movie';

export const contract = c.router(
  {
    auth,
    movie,
    test: {
      method: 'GET',
      path: '/test',
      responses: {
        [UnauthorizedError.statusCode]: authGuardSchema,
        [BadRequestError.statusCode]: BadRequestError.zodSchema,
        [HttpStatus.OK]: z.string(),
      },
    },
  },
  {
    pathPrefix: '/api',
    strictStatusCodes: true,
  },
);
