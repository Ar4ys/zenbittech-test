import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { HttpStatus } from '../constants';

const c = initContract();

export const contract = c.router(
  {
    test: {
      method: 'GET',
      path: '/test',
      responses: {
        [HttpStatus.BAD_REQUEST]: z.string(),
        [HttpStatus.OK]: z.string(),
      },
    },
  },
  {
    pathPrefix: '/api',
    strictStatusCodes: true,
  },
);
