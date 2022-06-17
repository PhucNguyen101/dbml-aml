import { omit } from 'lodash';
import { SYMBOL_CURRENCIES } from '../constants';
import { NumberFormat } from './formatNumber';

export type CurrencyFormat = {
  currency: string,
} & Omit<NumberFormat, 'prefix' | 'sufix'>

export const transformCurrencyFormat = (format: CurrencyFormat): NumberFormat => {
  const { currency } = format;
  const numberFormat = omit(format, 'currency');
  const isSymbolCurrency = SYMBOL_CURRENCIES
    .map(({ value }) => value)
    .includes(currency);
  if (isSymbolCurrency) {
    return {
      ...numberFormat,
      prefix: currency,
    };
  }
  return {
    ...numberFormat,
    suffix: ` ${currency}`,
  };
};
