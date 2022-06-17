import { THOUSAND, MILLION, BILLION } from '../constants';
import { formatNumber } from './formatNumber';
import { getNumberFormat, PreMigrationNumberFormat } from './getNumberFormat';

export default (format: PreMigrationNumberFormat): string => {
  const numberFormat = getNumberFormat(format);
  const { abbreviation, percentageConvertible } = numberFormat;
  switch (abbreviation) {
    case THOUSAND:
    case MILLION: {
      const sample = 1234000.12;
      return `1,234,000.12 ⟶ ${formatNumber(sample, numberFormat)}`;
    }
    case BILLION: {
      const sample = 1234000000.12;
      return `1,234,000,000.12 ⟶ ${formatNumber(sample, numberFormat)}`;
    }
    default:
      break;
  }
  if (percentageConvertible) {
    const sample = 0.1234;
    return `${sample} ⟶ ${formatNumber(sample, numberFormat)}`;
  }
  return formatNumber(1234.12, numberFormat);
};
