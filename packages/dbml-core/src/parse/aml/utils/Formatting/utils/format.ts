import { get, has } from 'lodash';
import { formatDate, DateTimeFormat } from './formatDate';
import { formatNumber } from './formatNumber';
import { getNumberFormat, PreMigrationNumberFormat } from './getNumberFormat';
import { NumberPatternFormat } from './toNumberFormat';
import { toNumberPatternFormat } from './toNumberPatternFormat';

export interface OldFormatDefinition {
  type: string,
  sub_type: string,
  options?: any,
}

type FormatType = DateTimeFormat | NumberPatternFormat | PreMigrationNumberFormat;
export interface FormatDefinition {
  type: string,
  format: FormatType,
}

export type ValueFormat = OldFormatDefinition | FormatDefinition
type ValueType = number | Date | string

// will be removed after migration
export const getOrTransformFormat = (formatdefinition: FormatDefinition): FormatType => {
  const { type, format } = formatdefinition;
  if (type === 'number' && !has(format, 'pattern')) {
    return toNumberPatternFormat(format as PreMigrationNumberFormat);
  }
  return format;
};

export const formatValue = (value: ValueType, formatDefinition: ValueFormat): string => {
  if (formatDefinition && 'format' in formatDefinition) {
    const { type, format } = formatDefinition;
    switch (type) {
      case 'number': {
        const numberFormat = getNumberFormat(format as PreMigrationNumberFormat| NumberPatternFormat);
        return formatNumber(value as number | string, numberFormat);
      }
      case 'date':
        return formatDate(value as Date | string, format as DateTimeFormat);
      default:
        break;
    }
  }
};
