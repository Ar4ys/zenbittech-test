import { z } from 'zod';

import { HttpStatus } from '../constants';
import { BadRequestError } from '../errors';
import { auth } from './auth';
import { c } from './contract';

export const contract = c.router(
  {
    auth,
    test: {
      method: 'GET',
      path: '/test',
      responses: {
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
