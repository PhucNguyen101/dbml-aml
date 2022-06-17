import { DateTimeFormat } from './formatDate';
import formatDateSample from './formatDateSample';
import formatNumberSample from './formatNumberSample';
import { PreMigrationNumberFormat } from './getNumberFormat';

export default (type: string, format: PreMigrationNumberFormat | DateTimeFormat): string => {
  switch (type) {
    case 'number':
      return formatNumberSample(format as PreMigrationNumberFormat);
    case 'date':
      return formatDateSample(format as DateTimeFormat);
    default:
      return '';
  }
};
