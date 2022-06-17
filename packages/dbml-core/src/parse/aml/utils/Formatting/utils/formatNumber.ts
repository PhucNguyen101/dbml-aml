import BigNumber from 'bignumber.js';
import { isNil } from 'lodash';
import { BILLION, MILLION, THOUSAND } from '../constants/abbreviationOptions';
import isNumber from './isNumber';

export enum NumberStyle {
  NONE = 'None',
  NORMAL = 'Normal',
  PERCENTAGE = 'Percentage',
  CURRENCY = 'Currency',
}

export interface NumberFormat {
  numberStyle? : NumberStyle,
  abbreviation? : string,
  prefix? : string,
  suffix? : string,
  decimalSeparator? : string,
  percentageConvertible? : boolean,
  groupSeparator?: string,
  decimalPlaces?: number,
}

const addPrefixOrSuffix = (format: NumberFormat): BigNumber.Format => {
  const { prefix, suffix, abbreviation } = format;
  if (abbreviation) {
    return prefix ? { prefix, suffix: abbreviation } : { suffix: abbreviation.concat(suffix || '') };
  }
  return prefix ? { prefix } : { suffix };
};

const buildUnitSymbol = (format: NumberFormat): BigNumber.Format => {
  const { numberStyle } = format;
  if (numberStyle === NumberStyle.PERCENTAGE) {
    return { suffix: '%' };
  }
  return addPrefixOrSuffix(format);
};

export const formatNumber = (value: number | string, format: NumberFormat): string => {
  if (isNil(value)) {
    return '';
  }
  let num = new BigNumber(value);
  if (!isNumber(num)) {
    return String(value);
  }
  if (format.numberStyle === NumberStyle.NONE) {
    return num.toFixed();
  }
  const {
    abbreviation, percentageConvertible,
    decimalSeparator, groupSeparator,
  } = format;
  if (percentageConvertible) {
    num = num.multipliedBy(100);
  }
  switch (abbreviation) {
    case THOUSAND:
      num = num.dividedBy(1000);
      break;
    case MILLION:
      num = num.dividedBy(1000000);
      break;
    case BILLION:
      num = num.dividedBy(1000000000);
      break;
    default:
      break;
  }
  const bigNumberFormat = {
    decimalSeparator: decimalSeparator || '.',
    groupSeparator: groupSeparator || ',',
    groupSize: 3,
    ...buildUnitSymbol(format),
  };
  const decimalPlaces = isNil(format.decimalPlaces) ? 2 : format.decimalPlaces;
  return num.toFormat(decimalPlaces, bigNumberFormat);
};
