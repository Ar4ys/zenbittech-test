import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from './http-errors';

export class UserAlreadyExistsError extends BadRequestError.extend(
  'UserAlreadyExistsException',
  BadRequestError.statusCode,
) {
  constructor(email: string) {
    super(`User with such email (${email}) already exists`);
  }
}

export class UserNotFoundError extends NotFoundError.extend(
  'UserNotFoundError',
  NotFoundError.statusCode,
) {
  constructor(email: string) {
    super(`User with such email (${email}) not found`);
  }
}

export class SessionExpiredError extends UnauthorizedError.extend(
  'SessionExpiredException',
  UnauthorizedError.statusCode,
) {
  constructor() {
    super('Session expired');
  }
}

export class IncorrectPasswordError extends UnauthorizedError.extend(
  'IncorrectPasswordError',
  UnauthorizedError.statusCode,
) {
  constructor() {
    super('Provided password is incorrect');
  }
}

export class MovieNotFoundError extends NotFoundError.extend(
  'MovieNotFoundError',
  NotFoundError.statusCode,
) {
  constructor(id: number) {
    super(`Movie with such id (${id}) is not found`);
  }
}

export class UserIsNotAnEventOwnerError extends ForbiddenError.extend(
  'UserIsNotAnEventOwnerError',
  ForbiddenError.statusCode,
) {
  constructor(userId: number, movieId: number) {
    super(`User with such id (${userId}) is not an owner of movie with such id (${movieId})`);
  }
}
