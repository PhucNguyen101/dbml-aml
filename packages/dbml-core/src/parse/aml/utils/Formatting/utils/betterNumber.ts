import BigNumber from 'bignumber.js';
import isNumber from './isNumber';

/**
 * Format a number into a better-looking number
 * @param value
 * @param mode
 *   * >= 0: number of decimal places
 *   * -1: no format
 *   * others: auto
 */
export default (value, mode: number = -1): string => {
  if (window._.isNil(value)) return '';

  const num: BigNumber = new BigNumber(value);

  if (!isNumber(num)) return value;

  let parsedMode = parseInt(`${mode}`);
  if (isNaN(parsedMode)) parsedMode = -2;

  if (parsedMode === -1) { // no format
    return num.toFixed();
  }

  let decimalPlaces: number;
  if (parsedMode < 0) { // auto format
    // legacy reason:
    // we previously used angular $filter('number') for 'auto'
    // which formats with 0 to 3 decimal places
    decimalPlaces = Math.min(num.dp(), 3);
  } else {
    decimalPlaces = parsedMode;
  }

  return num.toFormat(decimalPlaces);
};
