import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';

import { SessionExpiredError, UnauthorizedError } from '@repo/shared/errors';

import { AuthService } from './auth.service';
import { JWT_COOKIE_NAME, REQUEST_USER_FIELD } from './constants';
import { UserJwtPayloadDto } from './dtos';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies[JWT_COOKIE_NAME];

    if (!token) throw new UnauthorizedError('Absent jwt token');
    const tokenResult = (await this.authService.verifyToken(token))
      .mapErr((err) =>
        err instanceof TokenExpiredError
          ? new SessionExpiredError()
          : new UnauthorizedError('Unexpected jwt token error', { cause: err }),
      )
      .unwrap();

    request[REQUEST_USER_FIELD] = tokenResult;

    return true;
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      [REQUEST_USER_FIELD]: UserJwtPayloadDto;
    }
  }
}
