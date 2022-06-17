import { NumberFormat } from './formatNumber';
import { NumberPatternFormat, toNumberFormat } from './toNumberFormat';
import { CurrencyFormat, transformCurrencyFormat } from './transformCurrencyFormat';

export type PreMigrationNumberFormat = NumberFormat | CurrencyFormat;

export const getNumberFormat = (format: NumberPatternFormat | PreMigrationNumberFormat): NumberFormat => {
  if ('currency' in format) {
    return transformCurrencyFormat(format as CurrencyFormat);
  }
  if ('pattern' in format) {
    return toNumberFormat(format as NumberPatternFormat);
  }
  return format as NumberFormat;
};
