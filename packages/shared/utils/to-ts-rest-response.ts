import { Err, Ok, Result } from 'ts-results';

import { HttpStatus } from '../constants';
import { BaseHttpError } from '../errors';

type TsRestResponse<TStatus extends HttpStatus, TData> = { status: TStatus; body: TData };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HttpErrorToTsRestResponse<TErr extends BaseHttpError> = TErr extends any
  ? TsRestResponse<TErr['statusCode'], TErr>
  : never;

export function toTsRestResponse<TOk, TStatus extends HttpStatus>(
  okResult: Ok<TOk>,
  okStatusCode: TStatus,
): TsRestResponse<TStatus, TOk>;
export function toTsRestResponse<TErr extends BaseHttpError>(
  errResult: Err<TErr>,
): HttpErrorToTsRestResponse<TErr>;
export function toTsRestResponse<TOk, TErr extends BaseHttpError, TStatus extends HttpStatus>(
  result: Result<TOk, TErr>,
  okStatusCode: TStatus,
): TsRestResponse<TStatus, TOk> | HttpErrorToTsRestResponse<TErr>;
export function toTsRestResponse<TOk, TErr extends BaseHttpError, TStatus extends HttpStatus>(
  result: Result<TOk, TErr>,
  okStatusCode?: TStatus,
): TsRestResponse<TStatus, TOk> | HttpErrorToTsRestResponse<TErr> {
  if (result.ok) {
    return { status: okStatusCode!, body: result.val };
  } else {
    return {
      status: result.val.statusCode,
      body: result.val,
    } as HttpErrorToTsRestResponse<TErr>;
  }
}
