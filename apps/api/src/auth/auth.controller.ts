import { Controller, Res } from '@nestjs/common';
import { TsRest, TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { Response } from 'express';
import { Ok } from 'ts-results';

import { HttpStatus } from '@repo/shared/constants';
import { contract } from '@repo/shared/contracts';
import { toTsRestResponse } from '@repo/shared/utils';

import { AuthService } from './auth.service';
import { COOKIE_MAX_AGE, JWT_COOKIE_NAME } from './constants';

@TsRest({ validateResponses: true })
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @TsRestHandler(contract.auth.signUp)
  async postSignUp(@Res({ passthrough: true }) res: Response) {
    return tsRestHandler(contract.auth.signUp, async ({ body }) => {
      const { remember, ...data } = body;
      const response = await this.authService.signUp(data, remember);

      if (response.ok) {
        res.cookie(JWT_COOKIE_NAME, response.val.token, {
          maxAge: COOKIE_MAX_AGE,
        });
      }

      return toTsRestResponse(
        response.map((x) => x.user),
        HttpStatus.CREATED,
      );
    });
  }

  @TsRestHandler(contract.auth.signIn)
  async postSignIn(@Res({ passthrough: true }) res: Response) {
    return tsRestHandler(contract.auth.signIn, async ({ body }) => {
      const { remember, ...data } = body;
      const response = await this.authService.signIn(data, remember);

      if (response.ok) {
        res.cookie(JWT_COOKIE_NAME, response.val.token, {
          maxAge: COOKIE_MAX_AGE,
          sameSite: 'strict',
        });
      }

      return toTsRestResponse(
        response.map((x) => x.user),
        HttpStatus.OK,
      );
    });
  }

  @TsRestHandler(contract.auth.signOut)
  async postSignOut(@Res({ passthrough: true }) res: Response) {
    return tsRestHandler(contract.auth.signOut, async () => {
      res.clearCookie(JWT_COOKIE_NAME);
      return toTsRestResponse(Ok({ success: true }), HttpStatus.OK);
    });
  }
}
