// import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // TODO: Setup ConfigService
  // const configService = app.get(ConfigService);
  // const isProduction = configService.get('isProduction', { infer: true });

  // if (isProduction) app.useLogger(['fatal', 'error']);
  // TODO: TS-Rest does not support global prefix from nest
  // app.setGlobalPrefix('api');

  // app.useGlobalFilters(new HttpExceptionFilter())

  await app.listen(3000);
  // await app.listen(configService.get('PORT', { infer: true }));
}

bootstrap();
