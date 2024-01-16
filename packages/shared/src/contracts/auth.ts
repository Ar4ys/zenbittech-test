import { z } from 'zod';

import { HttpStatus } from '../constants';
import {
  IncorrectPasswordError,
  InternalServerError,
  UserAlreadyExistsError,
  UserNotFoundError,
} from '../errors';
import { tsRestErrorList } from '../utils';
import { authErrors, c } from './contract';

export const auth = c.router(
  {
    me: {
      method: 'GET',
      path: '/',
      headers: null,
      responses: {
        ...tsRestErrorList(InternalServerError, ...authErrors),
        [HttpStatus.OK]: z.object({
          userId: z.number(),
        }),
      },
    },
    signUp: {
      method: 'POST',
      path: '/sign-up',
      body: z.object({
        email: z.string().email(),
        password: z.string().min(6),
        remember: z.boolean(),
      }),
      responses: {
        ...tsRestErrorList(InternalServerError, UserAlreadyExistsError),
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
        ...tsRestErrorList(InternalServerError, UserNotFoundError, IncorrectPasswordError),
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
        ...tsRestErrorList(InternalServerError),
        [HttpStatus.OK]: z.object({
          success: z.literal(true),
        }),
      },
    },
  },
  {
    pathPrefix: '/auth',
    strictStatusCodes: true,
    validateResponseOnClient: true,
  },
);
