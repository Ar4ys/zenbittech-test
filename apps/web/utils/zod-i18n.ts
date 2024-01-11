import { defaultErrorMap, z, ZodErrorMap, ZodIssueCode, ZodParsedType } from 'zod';

export const formI18n = {
  required: 'This field must not be empty',
  max_one: 'This field must be less than {{count}} character long',
  max_other: 'This field must be less than {{count}} characters long',
  min_one: 'This field must be at least {{count}} character long',
  min_other: 'This field must be at least {{count}} characters long',
  maxNumber: 'This field must be less than {{count}}',
  minNumber: 'This field must be greater than {{count}}',
  minArray_one: 'This field must have at least {{count}} item',
  minArray_other: 'This field must have at least {{count}} items',
  maxArray_one: 'This field must have less than or equal to {{count}} item',
  maxArray_other: 'This field must have less than or equal to {{count}} items',
  invalid: 'This field is invalid',
  invalidType: {
    number: 'This field must contain only numbers',
    integer: 'This field must be an integer',
  },
};

const withCount = (one: string, other: string, count: number) =>
  count === 1
    ? one.replace('{{count}}', count.toString())
    : other.replace('{{count}}', count.toString());

export const zodI18nMap: ZodErrorMap = (issue, ctx) => {
  const defaultMessage = () => defaultErrorMap(issue, ctx).message;
  let message: string;

  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined || issue.received === ZodParsedType.null) {
        message = formI18n.required;
      } else if (issue.expected === ZodParsedType.number) {
        message = formI18n.invalidType.number;
      } else if (issue.expected === ZodParsedType.integer) {
        message = formI18n.invalidType.integer;
      } else {
        message = defaultMessage();
      }
      break;
    case ZodIssueCode.too_small:
      switch (issue.type) {
        case 'array':
          message = withCount(
            formI18n.minArray_one,
            formI18n.minArray_other,
            Number(issue.minimum),
          );
          break;
        case 'string':
          message =
            issue.minimum === 1
              ? formI18n.required
              : withCount(formI18n.min_one, formI18n.min_other, Number(issue.minimum));
          break;
        case 'number':
          message =
            issue.minimum === 1
              ? formI18n.required
              : withCount(formI18n.minNumber, formI18n.minNumber, Number(issue.minimum));
          break;
        default:
          message = defaultMessage();
      }
      break;
    case ZodIssueCode.too_big:
      switch (issue.type) {
        case 'array':
          message = withCount(
            formI18n.maxArray_one,
            formI18n.maxArray_other,
            Number(issue.maximum),
          );
          break;
        case 'string':
          message = withCount(formI18n.max_one, formI18n.max_other, Number(issue.maximum));
          break;
        case 'number':
          message = withCount(formI18n.maxNumber, formI18n.maxNumber, Number(issue.maximum));
          break;
        default:
          message = defaultMessage();
      }
      break;
    default:
      message = defaultErrorMap(issue, ctx).message;
  }

  return { message };
};

z.setErrorMap(zodI18nMap);
