import BigNumber from 'bignumber.js';

// https://mikemcl.github.io/bignumber.js/#type-coercion
BigNumber.prototype.valueOf = function () {
  throw Error('valueOf called on BigNumber!')
}
