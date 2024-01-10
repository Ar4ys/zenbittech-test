import { HttpStatus } from '../constants';
import { BaseHttpError } from './base-http-error';

export type InternalServerError = InstanceType<typeof InternalServerError>;
export const InternalServerError = BaseHttpError.extend(
  'InternalServerError',
  HttpStatus.INTERNAL_SERVER_ERROR,
);

export type BadRequestError = InstanceType<typeof BadRequestError>;
export const BadRequestError = BaseHttpError.extend('BadRequestError', HttpStatus.BAD_REQUEST);

export type UnauthorizedError = InstanceType<typeof UnauthorizedError>;
export const UnauthorizedError = BaseHttpError.extend('UnauthorizedError', HttpStatus.UNAUTHORIZED);

export type ForbiddenError = InstanceType<typeof ForbiddenError>;
export const ForbiddenError = BaseHttpError.extend('ForbiddenError', HttpStatus.FORBIDDEN);

export type NotFoundError = InstanceType<typeof NotFoundError>;
export const NotFoundError = BaseHttpError.extend('NotFoundError', HttpStatus.NOT_FOUND);
