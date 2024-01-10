import type { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Catch, HttpException, Logger } from '@nestjs/common';
import type { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const body = exception.getResponse();

    if (status >= 500) {
      this.logger.error(request.originalUrl, exception.stack);
      if (exception.cause) this.logger.error(exception.cause);
    } else {
      this.logger.verbose(request.originalUrl, exception.stack);
      if (exception.cause) this.logger.verbose(exception.cause);
    }

    if (typeof body === 'string') response.status(status).send(body);
    else response.status(status).json({ ...body, error: exception.name });
  }
}
