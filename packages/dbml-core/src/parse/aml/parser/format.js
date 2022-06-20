// convert with: https://www.typescriptlang.org/play#code/

import { find, get, isObject } from 'lodash';
import { NUMBER_FORMATS } from '../utils/Formatting/constants';

const dateFormatSeparatorMap = {
  'dd/LL/yyyy': '/',
  'dd.LL.yyyy': '.',
  'dd-LL-yyyy': '-',
  'LL/dd/yyyy': '/',
  'LL.dd.yyyy': '.',
  'LL-dd-yyyy': '-',
  'LLL dd, yyyy': null,
  'dd LLL, yyyy': null,
  'LLL dd yyyy': null,
};
export const converAMLNumberFormatToNumberFormat = (amlNumberFormat) => {
  if (isObject(amlNumberFormat)) {
    return amlNumberFormat;
  }
  const predefinedNumberFormat = find(NUMBER_FORMATS, ({ format }) => get(format, 'pattern', null) === amlNumberFormat);
  if (predefinedNumberFormat) {
    return predefinedNumberFormat.format;
  }
  return {
    pattern: amlNumberFormat,
  };
};
export const converAMLDateFormatToDateFormat = (amlDateFormat) => {
  const separator = dateFormatSeparatorMap[amlDateFormat];
  switch (separator) {
    case undefined:
      return {
        pattern: 'LLL dd yyyy',
      };
    case null:
      return {
        pattern: amlDateFormat,
      };
    default:
      return {
        separator,
        pattern: amlDateFormat.replace(/-|\/|\./g, ' '),
      };
  }
};
export const convertAMLFormatToFormat = (fieldType, amlFormat) => {
  if (fieldType === 'number') {
    return converAMLNumberFormatToNumberFormat(amlFormat);
  }
  return converAMLDateFormatToDateFormat(amlFormat);
};
export const convertNumberFormatToAMLNumberFormat = (format) => {
  if (get(format, 'decimalSeparator', '.') !== '.' || get(format, 'groupSeparator', ',') !== ',') {
    return format;
  }
  return format.pattern;
};
export const convertDateFormatToAMLDateFormat = (format) => {
  const pattern = format.pattern || 'dd LL yyyy';
  if ('separator' in format) {
    return pattern.replace(/ /g, format.separator);
  }
  return pattern;
};
export const convertFormatToAMLFormat = (fieldType, format) => {
  if (fieldType === 'number') {
    return convertNumberFormatToAMLNumberFormat(format);
  }
  return convertDateFormatToAMLDateFormat(format);
};
