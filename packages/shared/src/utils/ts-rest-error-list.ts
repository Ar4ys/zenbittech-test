import { AnyZodObject, ZodTypeAny, ZodUnion } from 'zod';

import { HttpStatus } from '../constants';

// `any` is commonly used in meta-programming in typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
type UnionToIntersection<U> = (U extends never ? never : (arg: U) => never) extends (
  arg: infer I,
) => void
  ? I
  : never;

/**
 * The code for `UnionToTuple` is taken from comment in
 * [microsoft/TypeScript#13298](https://github.com/microsoft/TypeScript/issues/13298#issuecomment-1610361208)
 *
 * [YOU MUST READ THIS STACKOVERFLOW ANSWER](https://stackoverflow.com/a/55128956/13157478) before
 * using `UnionToTuple` for anything else.
 *
 * Using `UnionToTuple` in {@link TsRestErrorList} is safe and justified, because:
 *
 * - **You can't rely on the ordering of a union type**
 *
 *   We do not rely on ordering of a generated tuple type, because generated tuple is only used to
 *   create {@link ZodUnion} (which requires tuple as it's first generic) which is then used inside
 *   ts-rest to convert back to union.
 * - **Edge cases with what the compiler considers a union and when it collapses or expands**
 *
 *   We are not affected by those edge cases, because we only use `UnionToTuple` with objects.
 * - **UnionToTuple implementation is slow because of abuse of recursive conditional types**
 *
 *   This implementation is optimized by [@Dragon-Hatcher](https://github.com/Dragon-Hatcher) by
 *   taking advantage of tail-call optimization for certain types of recursive types in TS. It is
 *   stated that this implementation can work with unions of size up to 1000. In a typical codebase
 *   it is expected that error unions will not exceed the size of 10 elements.
 */
type UnionToTuple<T, A extends any[] = []> = UnionToIntersection<
  T extends never ? never : (t: T) => T
> extends (_: never) => infer W
  ? UnionToTuple<Exclude<T, W>, [...A, W]>
  : A;

type AnyZodUnion = ZodUnion<any>;

type IndexOf<T extends any[]> = Exclude<keyof T, keyof any[]>;
type ParseInt<T> = T extends `${infer N extends number}` ? N : never;

type HttpErrorInterface = {
  zodSchema: AnyZodObject;
  statusCode: HttpStatus;
};

type UnionToZodUnionSchema<T extends ZodTypeAny> = UnionToTuple<T> extends [any, any, ...any[]]
  ? ZodUnion<UnionToTuple<T>>
  : T;

type TsRestErrorList<TErrors extends HttpErrorInterface[]> = {
  [TIndex in IndexOf<TErrors> as TErrors[ParseInt<TIndex>]['statusCode']]: UnionToZodUnionSchema<
    TErrors[ParseInt<TIndex>]['zodSchema']
  >;
};
/* eslint-enable */

export function tsRestErrorList<T extends HttpErrorInterface[]>(...errors: T): TsRestErrorList<T> {
  const errorsContract: Partial<Record<HttpStatus, AnyZodObject | AnyZodUnion>> = {};

  for (const error of errors) {
    errorsContract[error.statusCode] =
      errorsContract[error.statusCode]?.or(error.zodSchema) ?? error.zodSchema;
  }

  return errorsContract as TsRestErrorList<T>;
}
