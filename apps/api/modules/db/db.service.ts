import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import postgres, { Sql } from 'postgres';

import { AppDb, createDb, runMigrations } from '@/db';
import { Environment } from '@/environment';

@Injectable()
export class DbService {
  public readonly db: AppDb;
  private readonly postgresConnection: Sql;

  constructor(private readonly configService: ConfigService<Environment, true>) {
    this.postgresConnection = postgres({
      host: this.configService.get('DB_HOST', { infer: true }),
      port: this.configService.get('DB_PORT', { infer: true }),
      user: this.configService.get('DB_USERNAME', { infer: true }),
      pass: this.configService.get('DB_PASSWORD', { infer: true }),
      db: this.configService.get('DB_DATABASE', { infer: true }),
    });
    this.db = createDb(this.postgresConnection);
  }

  public async migrate() {
    await runMigrations(this.db);
  }
}
