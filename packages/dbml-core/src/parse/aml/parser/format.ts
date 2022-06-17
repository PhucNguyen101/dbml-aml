import { find, get, isObject } from 'lodash';
import { AMLDateFormat, AMLFormat, AMLNumberFormat } from '../../types/type';
import { NUMBER_FORMATS } from '../utils/Formatting/constants';
import { DateTimeFormat } from '../utils/Formatting/utils/formatDate';
import { NumberPatternFormat } from '../utils/Formatting/utils/toNumberFormat';

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

export const converAMLNumberFormatToNumberFormat = (amlNumberFormat: AMLNumberFormat): NumberPatternFormat => {
  if (isObject(amlNumberFormat)) {
    return amlNumberFormat;
  }
  const predefinedNumberFormat = find(NUMBER_FORMATS, ({ format }) => get(format, 'pattern', null) === amlNumberFormat);
  if (predefinedNumberFormat) {
    return predefinedNumberFormat.format as NumberPatternFormat;
  }
  return {
    pattern: amlNumberFormat,
  };
};

export const converAMLDateFormatToDateFormat = (amlDateFormat: AMLDateFormat): DateTimeFormat => {
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

export const convertAMLFormatToFormat = (fieldType: 'date' | 'number', amlFormat: AMLFormat): NumberPatternFormat | DateTimeFormat => {
  if (fieldType === 'number') {
    return converAMLNumberFormatToNumberFormat(amlFormat);
  }
  return converAMLDateFormatToDateFormat(amlFormat as AMLDateFormat);
};

export const convertNumberFormatToAMLNumberFormat = (format: NumberPatternFormat): AMLNumberFormat => {
  if (get(format, 'decimalSeparator', '.') !== '.' || get(format, 'groupSeparator', ',') !== ',') {
    return format as AMLNumberFormat;
  }
  return format.pattern;
};

export const convertDateFormatToAMLDateFormat = (format: DateTimeFormat): AMLDateFormat => {
  const pattern = format.pattern || 'dd LL yyyy';
  if ('separator' in format) {
    return pattern.replace(/ /g, format.separator as string);
  }
  return pattern;
};

export const convertFormatToAMLFormat = (fieldType: 'date' | 'number', format: NumberPatternFormat | DateTimeFormat): AMLFormat => {
  if (fieldType === 'number') {
    return convertNumberFormatToAMLNumberFormat(format as NumberPatternFormat);
  }
  return convertDateFormatToAMLDateFormat(format);
};
