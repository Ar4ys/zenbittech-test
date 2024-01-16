import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from './http-errors';

export class UserAlreadyExistsError extends BadRequestError.extend('UserAlreadyExistsError') {
  constructor(email: string) {
    super(`User with such email (${email}) already exists`);
  }
}

export class UserNotFoundError extends NotFoundError.extend('UserNotFoundError') {
  constructor(email: string) {
    super(`User with such email (${email}) not found`);
  }
}

export class SessionExpiredError extends UnauthorizedError.extend('SessionExpiredError') {
  constructor() {
    super('Session expired');
  }
}

export class IncorrectPasswordError extends UnauthorizedError.extend('IncorrectPasswordError') {
  constructor() {
    super('Provided password is incorrect');
  }
}

export class MovieNotFoundError extends NotFoundError.extend('MovieNotFoundError') {
  constructor(id: number) {
    super(`Movie with such id (${id}) is not found`);
  }
}

export class UserIsNotAnEventOwnerError extends ForbiddenError.extend(
  'UserIsNotAnEventOwnerError',
) {
  constructor(userId: number, movieId: number) {
    super(`User with such id (${userId}) is not an owner of movie with such id (${movieId})`);
  }
}
