import { Controller } from '@nestjs/common';
import { TsRest, TsRestHandler, tsRestHandler } from '@ts-rest/nest';

import { HttpStatus } from '@repo/shared/constants';
import { contract } from '@repo/shared/contracts';
import { toTsRestResponse } from '@repo/shared/utils';

import { AppService } from './app.service';

@TsRest({ validateResponses: true })
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @TsRestHandler(contract.test)
  getHello() {
    return tsRestHandler(contract.test, async () => {
      const result = await this.appService.getHello();
      return toTsRestResponse(HttpStatus.OK, result);
    });
  }
}
