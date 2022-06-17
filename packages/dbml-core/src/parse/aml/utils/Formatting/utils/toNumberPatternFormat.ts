import { isNil, pickBy } from 'lodash';
import { NumberStyle } from './formatNumber';
import { BILLION, MILLION, THOUSAND } from '../constants/abbreviationOptions';
import { NumberPatternFormat } from './toNumberFormat';
import { getNumberFormat, PreMigrationNumberFormat } from './getNumberFormat';

export const toNumberPatternFormat = (format: PreMigrationNumberFormat): NumberPatternFormat => {
  const numberFormat = getNumberFormat(format);
  const {
    decimalSeparator, groupSeparator,
    numberStyle, percentageConvertible,
    abbreviation, prefix, suffix,
  } = numberFormat;
  if (numberStyle === NumberStyle.NONE) {
    return { pattern: 'none' };
  }
  const decimalPlaces = isNil(numberFormat.decimalPlaces) ? 2 : numberFormat.decimalPlaces;
  const decimalPart = decimalPlaces ? `0.${'0'.repeat(decimalPlaces)}` : '';
  let percentagePart = '';
  if (numberStyle === NumberStyle.PERCENTAGE) {
    percentagePart = percentageConvertible ? '%' : '\\%';
  }
  let abbreviationPart = '';
  switch (abbreviation) {
    case THOUSAND:
      abbreviationPart = ',"K"';
      break;
    case MILLION:
      abbreviationPart = ',,"M"';
      break;
    case BILLION:
      abbreviationPart = ',,,"B"';
      break;
    default:
      break;
  }
  let pattern = `#,###${decimalPart}${percentagePart}${abbreviationPart}`;
  if (numberStyle === NumberStyle.CURRENCY) {
    const tailCurrency = suffix ? ` [$${suffix.trimStart()}]` : '';
    pattern = tailCurrency ? `${pattern}${tailCurrency}` : `[$${prefix}]${pattern}`;
  }
  const patternFormat: NumberPatternFormat = {
    pattern,
    decimalSeparator,
    groupSeparator,
  };
  return pickBy(patternFormat, (value) => value) as NumberPatternFormat;
};
