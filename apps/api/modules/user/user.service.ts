import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcrypt';
import { eq } from 'drizzle-orm';
import { Err, Ok, Result } from 'ts-results';

import { UserAlreadyExistsError } from '@repo/shared/errors';

import { AppDb, User, UserInsert, users } from '@/db';
import { Environment } from '@/environment';

import { DbService } from '../db';

@Injectable()
export class UserService {
  private readonly db: AppDb;
  private readonly PASSWORD_SALT_ROUNDS: number;

  constructor(
    private dbService: DbService,
    private configService: ConfigService<Environment, true>,
  ) {
    this.db = this.dbService.db;
    this.PASSWORD_SALT_ROUNDS = this.configService.get('PASSWORD_SALT_ROUNDS', {
      infer: true,
    });
  }

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, this.PASSWORD_SALT_ROUNDS);
  }

  async createUser(data: UserInsert): Promise<Result<User, UserAlreadyExistsError>> {
    const { email, password } = data;
    const lowercaseEmail = email.toLowerCase();
    const doesUserExist = await this.db.query.users.findFirst({
      where: eq(users.email, lowercaseEmail),
    });

    if (doesUserExist) return Err(new UserAlreadyExistsError(data.email));
    const hashedPassword = await this.hashPassword(password);

    const [user] = await this.db
      .insert(users)
      .values({
        ...data,
        email: lowercaseEmail,
        password: hashedPassword,
      })
      .returning();

    return Ok(user);
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.db.query.users.findFirst({ where: eq(users.email, email) });
  }
}
