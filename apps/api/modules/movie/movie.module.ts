import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { DbModule } from '../db';
import { ImageModule } from '../image';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

@Module({
  imports: [DbModule, ImageModule, AuthModule],
  providers: [MovieService],
  exports: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
