import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Ok, Result } from 'ts-results';

import { BadRequestError } from '@repo/shared/errors';

import { AppDb } from '@/db';

import { DbService } from '../db';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly db: AppDb;

  constructor(private readonly dbService: DbService) {
    this.db = this.dbService.db;
  }

  async getHello(id: number): Promise<Result<string, BadRequestError>> {
    const user = await this.db.query.users.findFirst();
    return Ok(user?.email ?? `currentUser: ${id}`);
  }

  async onApplicationBootstrap() {
    await this.dbService.migrate();
  }
}
