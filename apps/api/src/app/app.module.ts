import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { environmentValidator, getEnvironmentFilePath } from '@/environment';

import { AuthModule } from '../auth/auth.module';
import { DbModule } from '../db';
import { UPLOAD_PATH } from '../image';
import { MovieModule } from '../movie';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: environmentValidator,
      isGlobal: true,
      envFilePath: getEnvironmentFilePath(),
    }),
    DbModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: UPLOAD_PATH,
      exclude: ['/api/(.*)'],
    }),
    MovieModule,
  ],
  providers: [AppService],
})
export class AppModule {}
