import { z } from 'zod';

import { HttpStatus } from '../constants';

export abstract class BaseHttpError extends Error {
  static zodSchema = z.object({
    message: z.string(),
  });

  static statusCode: HttpStatus;

  abstract override name: string;
  abstract statusCode: HttpStatus;

  static extend<TName extends string, TStatus extends HttpStatus>(
    name: TName,
    statusCode: TStatus,
  ): HttpErrorConstructor<TName, TStatus> {
    return class HttpErrorImpl extends this {
      static override statusCode = statusCode;
      static override zodSchema = super.zodSchema.extend({
        name: z.literal(name),
      });

      override name = name;
      override statusCode = statusCode;

      static override extend<T extends string>(name: T) {
        return super.extend(name, statusCode);
      }
    };
  }
}

type Merge<T, K> = Omit<T, keyof K> & K;

type HttpErrorConstructor<TName extends string, TStatus extends HttpStatus> = Merge<
  typeof Error,
  {
    new (...args: ConstructorParameters<typeof BaseHttpError>): HttpError<TName, TStatus>;
    statusCode: TStatus;
    zodSchema: ReturnType<typeof BaseHttpError.zodSchema.extend<{ name: z.ZodLiteral<TName> }>>;
    extend<T extends string>(name: T): HttpErrorConstructor<T, TStatus>;
  }
>;

type HttpError<TName extends string, TStatus extends HttpStatus> = Merge<
  Error,
  {
    statusCode: TStatus;
    name: TName;
  }
>;
