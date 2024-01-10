import { Injectable } from '@nestjs/common';
import { Ok, Result } from 'ts-results';

import { BadRequestError } from '@repo/shared/errors';
import { LOL } from '@repo/shared/test';

@Injectable()
export class AppService {
  getHello(): Result<string, BadRequestError> {
    return Ok(LOL);
  }
}
