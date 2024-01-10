import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { environmentValidator, getEnvironmentFilePath } from '@/environment';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
