import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';

// import { HttpExceptionFilter } from './common/exception-filters/http-exception.filter';
// import { ValidationException } from './common/exceptions/validation-bad-request.exception';
import { Environment, NodeEnv } from './environment';
import { AppModule } from './modules/app';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<Environment, true>);
  const apiPort = configService.get('API_PORT', { infer: true });
  const isProduction = configService.get('NODE_ENV', { infer: true }) === NodeEnv.PRODUCTION;

  if (isProduction) app.useLogger(['fatal', 'error']);

  app.setGlobalPrefix('api');
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     validateCustomDecorators: true,
  //     exceptionFactory: (errors) => new ValidationException(errors),
  //   }),
  // );
  // app.useGlobalInterceptors(
  //   new ClassSerializerInterceptor(app.get(Reflector), {
  //     excludeExtraneousValues: true,
  //   }),
  // );
  // app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(apiPort);
}

bootstrap();
