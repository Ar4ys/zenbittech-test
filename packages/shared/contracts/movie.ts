import { z } from 'zod';

import { HttpStatus } from '../constants';
import { InternalServerError, MovieNotFoundError, UserIsNotAnEventOwnerError } from '../errors';
import { tsRestErrorList } from '../utils';
import { authErrors, c } from './contract';

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
        ...tsRestErrorList(InternalServerError, ...authErrors),
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
        title: z
          .string()
          // For some reason strings in `FormData` have quotes around them
          .min(3 + 2)
          .transform((value) => value.slice(1, -1)),
        publishingYear: z.coerce.number().min(1800),
      }),
      responses: {
        ...tsRestErrorList(InternalServerError, ...authErrors),
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
          title: z
            .string()
            // For some reason strings in `FormData` have quotes around them
            .min(3 + 2)
            .transform((value) => value.slice(1, -1)),
          publishingYear: z.coerce.number().min(1800),
        })
        .partial(),
      responses: {
        ...tsRestErrorList(
          InternalServerError,
          ...authErrors,
          MovieNotFoundError,
          UserIsNotAnEventOwnerError,
        ),
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
        ...tsRestErrorList(
          InternalServerError,
          ...authErrors,
          MovieNotFoundError,
          UserIsNotAnEventOwnerError,
        ),
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
