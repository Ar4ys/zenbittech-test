import {
  Catch,
  HttpException,
  Logger,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Response } from 'express';

import { BaseHttpError } from '@repo/shared/errors';

@Catch(HttpException, BaseHttpError)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException | BaseHttpError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();
    let status;
    let body;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      body = exception.getResponse();
    } else {
      const result = (exception.constructor as typeof BaseHttpError).zodSchema.safeParse(exception);
      if (!result.success)
        throw new Error(`${exception.constructor.name} does not match it's own zodSchema`, {
          cause: result.error,
        });

      status = exception.statusCode;
      body = result.data;
    }

    if (status >= 500) {
      this.logger.error(request.originalUrl, exception.stack);
      if (exception.cause) this.logger.error(exception.cause);
    } else {
      this.logger.verbose(request.originalUrl, exception.stack);
      if (exception.cause) this.logger.verbose(exception.cause);
    }

    if (typeof body === 'string') response.status(status).send(body);
    else response.status(status).json({ ...body, name: exception.name });
  }
}
