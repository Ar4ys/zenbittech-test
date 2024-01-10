import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';

import { HttpExceptionFilter } from './common/exception-filters';
import { Environment, NodeEnv } from './environment';
import { AppModule } from './modules/app';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<Environment, true>);
  const bootstrapLogger = new Logger('bootstrap');
  const apiPort = configService.get('API_PORT', { infer: true });
  const isProduction = configService.get('NODE_ENV', { infer: true }) === NodeEnv.PRODUCTION;

  if (isProduction) app.useLogger(['fatal', 'error']);

  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalInterceptors(new ZodSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(apiPort, () => bootstrapLogger.log(`Listening on port ${apiPort}`));
}

bootstrap();
