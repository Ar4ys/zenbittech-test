import { z } from 'zod';

import { HttpStatus } from '../constants';
import {
  InternalServerError,
  MovieNotFoundError,
  UnauthorizedError,
  UserIsNotAnEventOwnerError,
} from '../errors';
import { authGuardSchema, c } from './contract';

const movieWithImageSchema = z.object({
  id: z.number(),
  title: z.string(),
  publishingYear: z.number(),
  ownerId: z.number(),
  imageId: z.number(),
  image: z.object({
    id: z.number(),
    url: z.string(),
    blurhash: z.string(),
  }),
});

export const movie = c.router(
  {
    getPaginated: {
      method: 'GET',
      path: '/',
      query: z.object({
        page: z.coerce.number().min(0).default(0),
      }),
      responses: {
        [InternalServerError.statusCode]: InternalServerError.zodSchema,
        [UnauthorizedError.statusCode]: authGuardSchema,
        [HttpStatus.OK]: z.object({
          totalPages: z.number(),
          currentPage: z.number(),
          movies: movieWithImageSchema.array(),
        }),
      },
    },
    create: {
      method: 'POST',
      contentType: 'multipart/form-data',
      path: '/',
      body: z.object({
        image: z.custom<File>(() => true),
        title: z.string().min(3),
        publishingYear: z.coerce.number().min(1800),
      }),
      responses: {
        [InternalServerError.statusCode]: InternalServerError.zodSchema,
        [UnauthorizedError.statusCode]: authGuardSchema,
        [HttpStatus.CREATED]: movieWithImageSchema,
      },
    },
    update: {
      method: 'PATCH',
      contentType: 'multipart/form-data',
      path: '/:id',
      pathParams: z.object({
        id: z.coerce.number(),
      }),
      body: z
        .object({
          image: z.custom<File>(() => true),
          title: z.string().min(3),
          publishingYear: z.coerce.number().min(1800),
        })
        .partial(),
      responses: {
        [InternalServerError.statusCode]: InternalServerError.zodSchema,
        [UnauthorizedError.statusCode]: authGuardSchema,
        [MovieNotFoundError.statusCode]: MovieNotFoundError.zodSchema,
        [UserIsNotAnEventOwnerError.statusCode]: UserIsNotAnEventOwnerError.zodSchema,
        [HttpStatus.OK]: movieWithImageSchema,
      },
    },
    delete: {
      method: 'DELETE',
      path: '/:id',
      pathParams: z.object({
        id: z.coerce.number(),
      }),
      body: null,
      responses: {
        [InternalServerError.statusCode]: InternalServerError.zodSchema,
        [UnauthorizedError.statusCode]: authGuardSchema,
        [MovieNotFoundError.statusCode]: MovieNotFoundError.zodSchema,
        [UserIsNotAnEventOwnerError.statusCode]: UserIsNotAnEventOwnerError.zodSchema,
        [HttpStatus.OK]: z.object({
          success: z.literal(true),
        }),
      },
    },
  },
  {
    pathPrefix: '/movie',
    strictStatusCodes: true,
  },
);
