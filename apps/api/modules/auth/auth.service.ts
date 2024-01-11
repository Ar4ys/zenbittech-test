import { Injectable } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { ZodError } from 'nestjs-zod/z';
import { Err, Ok, Result } from 'ts-results';

import {
  IncorrectPasswordError,
  UserAlreadyExistsError,
  UserNotFoundError,
} from '@repo/shared/errors';

import { UserService } from '../user/user.service';
import { UserJwtPayloadDto, userJwtPayloadSchema } from './dtos';
import { SignInData, SignInReturnData, SignUpData, SignUpReturnData } from './types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private generateToken(payload: UserJwtPayloadDto, longLived = false): string {
    return this.jwtService.sign(payload, { expiresIn: longLived ? '7d' : '1d' });
  }

  async verifyToken(
    jwtToken: string,
  ): Promise<
    Result<
      UserJwtPayloadDto,
      ZodError<UserJwtPayloadDto> | JsonWebTokenError | TokenExpiredError | Error
    >
  > {
    return (
      await Result.wrapAsync<unknown, JsonWebTokenError | TokenExpiredError | Error>(() =>
        this.jwtService.verifyAsync(jwtToken),
      )
    )
      .map((data) => userJwtPayloadSchema.safeParse(data))
      .andThen((data) => (data.success ? Ok(data.data) : Err(data.error)));
  }

  async signUp(
    data: SignUpData,
    remember = false,
  ): Promise<Result<SignUpReturnData, UserAlreadyExistsError>> {
    const user = await this.userService.createUser(data);
    if (user.err) return user;

    const { id: userId } = user.val;
    const accessToken = this.generateToken({ userId }, remember);

    return Ok({ user: user.val, token: accessToken });
  }

  async signIn(
    data: SignInData,
    remember = false,
  ): Promise<Result<SignInReturnData, UserNotFoundError | IncorrectPasswordError>> {
    const { email, password } = data;

    const user = await this.userService.findUserByEmail(email);
    if (!user) return Err(new UserNotFoundError(email));

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) return Err(new IncorrectPasswordError());

    const accessToken = this.generateToken({ userId: user.id }, remember);

    return Ok({ user, token: accessToken });
  }
}
