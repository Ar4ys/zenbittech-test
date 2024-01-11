import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { REQUEST_USER_FIELD } from './constants';

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();

  return request[REQUEST_USER_FIELD];
});
