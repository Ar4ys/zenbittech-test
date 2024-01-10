import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { HttpStatus } from '../constants';
import { BadRequestError } from '../errors';

const c = initContract();

export const contract = c.router(
  {
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
