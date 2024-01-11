import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { environmentValidator, getEnvironmentFilePath } from '@/environment';

import { AuthModule } from '../auth/auth.module';
import { DbModule } from '../db';
import { AppController } from './app.controller';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
