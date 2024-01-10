import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environmentValidator } from 'environment';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot({ validate: environmentValidator, isGlobal: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
