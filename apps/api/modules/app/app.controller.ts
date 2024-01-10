import { Controller } from '@nestjs/common';
import { TsRest, TsRestHandler, tsRestHandler } from '@ts-rest/nest';

import { contract } from '@repo/shared/contracts';

import { AppService } from './app.service';

@TsRest({ validateResponses: true })
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @TsRestHandler(contract.test)
  getHello() {
    return tsRestHandler(contract.test, async () => {
      const result = this.appService.getHello();
      return { status: 200, body: result };
    });
  }
}
