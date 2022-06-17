import { isNil } from 'lodash';
import { luxonFrom } from './luxonHelpers';

export interface DateTimeFormat {
  pattern? : string,
  separator? : string,
}

// If value type is number, it's the epoch time (UTC) that originated from a date object
export const formatDate = (value: Date | number | string, format: DateTimeFormat): string => {
  if (isNil(value)) {
    return '';
  }

  const luxonInstance = luxonFrom(value);
  if (!luxonInstance?.isValid) {
    return String(value);
  }

  const pattern = format.pattern || 'dd LL yyyy';
  const separator = format.separator || '/';
  switch (pattern) {
    case 'dd LL yyyy':
    case 'LL dd yyyy': {
      const finalPattern = pattern
        .split(' ')
        .join(separator);
      return luxonInstance.toFormat(finalPattern);
    }
    default:
      break;
  }
  return luxonInstance.toFormat(pattern);
};
