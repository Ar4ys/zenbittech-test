import { z } from 'zod';

import { HttpStatus } from '../constants';
import { IncorrectPasswordError, UserAlreadyExistsError, UserNotFoundError } from '../errors';
import { c } from './contract';

export const auth = c.router(
  {
    signUp: {
      method: 'POST',
      path: '/sign-up',
      body: z.object({
        email: z.string().email(),
        password: z.string().min(6),
        remember: z.boolean(),
      }),
      responses: {
        [UserAlreadyExistsError.statusCode]: UserAlreadyExistsError.zodSchema,
        [HttpStatus.CREATED]: z.object({
          id: z.number(),
          email: z.string(),
        }),
      },
    },
    signIn: {
      method: 'POST',
      path: '/sign-in',
      body: z.object({
        email: z.string(),
        password: z.string(),
        remember: z.boolean(),
      }),
      responses: {
        [UserNotFoundError.statusCode]: UserNotFoundError.zodSchema,
        [IncorrectPasswordError.statusCode]: IncorrectPasswordError.zodSchema,
        [HttpStatus.OK]: z.object({
          id: z.number(),
          email: z.string(),
        }),
      },
    },
    signOut: {
      method: 'DELETE',
      path: '/sign-out',
      body: null,
      responses: {
        [HttpStatus.OK]: z.object({
          success: z.literal(true),
        }),
      },
    },
  },
  {
    pathPrefix: '/auth',
    strictStatusCodes: true,
  },
);
