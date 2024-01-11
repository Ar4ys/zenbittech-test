import { Controller, UseGuards } from '@nestjs/common';
import { TsRest, TsRestHandler, tsRestHandler } from '@ts-rest/nest';

import { HttpStatus } from '@repo/shared/constants';
import { contract } from '@repo/shared/contracts';
import { toTsRestResponse } from '@repo/shared/utils';

import { AuthGuard } from '../auth/auth.guard';
import { User } from '../auth/decorators';
import { UserJwtPayloadDto } from '../auth/dtos';
import { AppService } from './app.service';

@TsRest({ validateResponses: true })
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @TsRestHandler(contract.test)
  @UseGuards(AuthGuard)
  getHello(@User() user: UserJwtPayloadDto) {
    return tsRestHandler(contract.test, async () => {
      const result = await this.appService.getHello(user.userId);
      return toTsRestResponse(HttpStatus.OK, result);
    });
  }
}
