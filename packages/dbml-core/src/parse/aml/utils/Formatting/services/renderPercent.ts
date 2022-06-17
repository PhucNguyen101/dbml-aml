import BigNumber from 'bignumber.js';
import { isNumber } from '../utils';

export default (value): string => {
  const num: BigNumber = new BigNumber(value);
  if (!isNumber(num)) return value;

  return `${num.times(100).toFixed(2)}%`;
};
