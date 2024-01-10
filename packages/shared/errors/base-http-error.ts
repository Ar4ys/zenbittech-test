import { z } from 'zod';

import { HttpStatus } from '../constants';

export abstract class BaseHttpError extends Error {
  static zodSchema = z.object({
    message: z.string(),
  });

  static statusCode: HttpStatus;
  static override name: string;

  abstract override name: string;
  abstract statusCode: HttpStatus;

  static extend<TName extends string, TStatus extends HttpStatus>(
    name: TName,
    statusCode: TStatus,
  ) {
    return class HttpError extends this {
      static override name = name;
      static override statusCode = statusCode;
      static override zodSchema = super.zodSchema.extend({
        name: z.literal(name),
      });

      override name = name;
      override statusCode = statusCode;
    };
  }
}
