import { HttpStatus } from '../constants';
import { BaseHttpError } from './base-http-error';

export class InternalServerError extends BaseHttpError.extend(
  'InternalServerError',
  HttpStatus.INTERNAL_SERVER_ERROR,
) {}

export class BadRequestError extends BaseHttpError.extend(
  'BadRequestError',
  HttpStatus.BAD_REQUEST,
) {}

export class UnauthorizedError extends BaseHttpError.extend(
  'UnauthorizedError',
  HttpStatus.UNAUTHORIZED,
) {}

export class ForbiddenError extends BaseHttpError.extend('ForbiddenError', HttpStatus.FORBIDDEN) {}

export class NotFoundError extends BaseHttpError.extend('NotFoundError', HttpStatus.NOT_FOUND) {}
