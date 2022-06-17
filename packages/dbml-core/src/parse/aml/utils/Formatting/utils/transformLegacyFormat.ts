// import { ValueFormatter } from 'raw/value_formatter_raw';
// import { SYMBOL_CURRENCIES } from '../constants';
// import { DateTimeFormat } from './formatDate';
// import { NumberPatternFormat } from './toNumberFormat';

// const transformCurrencyToPatternFormat = (currency: string): NumberPatternFormat => {
//   const isSymbolCurrency = SYMBOL_CURRENCIES
//     .map(({ value }) => value)
//     .includes(currency);
//   if (isSymbolCurrency) {
//     return { pattern: `[$${currency}]#,###0.00` };
//   }
//   return { pattern: `#,###0.00 [$${currency}]` };
// };

// export default (subType: string): NumberPatternFormat | DateTimeFormat | { sub_type: string } => {
//   const legacyNumberFormats: Record<string, string> = ValueFormatter.FORMATS.NUMBER;
//   const legacyDateFormats: Record<string, string> = ValueFormatter.FORMATS.DATE;
//   switch (subType) {
//     case legacyNumberFormats.Percent:
//       return { pattern: '#,###0.00%' };
//     case legacyNumberFormats.Auto:
//       return { pattern: 'inherited' };
//     case legacyNumberFormats.XX:
//       return { pattern: '#,###' };
//     case legacyNumberFormats['XX.X']:
//       return { pattern: '#,###0.0' };
//     case legacyNumberFormats['No Format']:
//       return { pattern: 'none' };
//     case legacyNumberFormats['XX.XX']:
//       return { pattern: '#,###0.00' };

//     case legacyDateFormats.Auto:
//     case legacyDateFormats["By 'time_period' Filter"]:
//       return { pattern: 'LLL dd yyyy' };
//     case legacyDateFormats.Day:
//       return { pattern: 'LLL dd, yyyy' };
//     case legacyDateFormats.Month:
//       return { pattern: 'LLL yyyy' };
//     case legacyDateFormats.Quarter:
//       return { pattern: 'yyyy Qq' };
//     case legacyDateFormats.Year:
//       return { pattern: 'yyyy' };
//     case legacyDateFormats.Week:
//       return { sub_type: 'wwww' };
//     default:
//       break;
//   }
//   const betweenQuotesPattern = /"([^']+)"/;
//   const currencySearchResults = subType && subType.match(betweenQuotesPattern);
//   if (currencySearchResults) {
//     const currency = currencySearchResults[1];
//     return transformCurrencyToPatternFormat(currency);
//   }
//   return { sub_type: 'auto' };
// };
