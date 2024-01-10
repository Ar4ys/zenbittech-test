import { Injectable } from '@nestjs/common';
import { LOL } from '@repo/shared/test';

@Injectable()
export class AppService {
  getHello(): string {
    return LOL;
  }
}
