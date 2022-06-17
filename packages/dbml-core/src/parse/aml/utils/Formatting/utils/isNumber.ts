import BigNumber from 'bignumber.js';

export default (value): boolean => {
  return !(new BigNumber(value)).isNaN();
}
