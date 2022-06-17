import Utils from '../../../../utils/es6';
import { isEqual } from 'lodash';
import {
  formatValue, FormatDefinition, OldFormatDefinition, ValueFormat,
} from './format';
import isNumber from './isNumber';

export const abbreviateOrFormatNumber = (value: number | string, formatDefinition: ValueFormat): string => {
  if (!isNumber(value)) {
    return String(value);
  }
  const numberValue = Number.parseFloat(value as string);
  const { format } = formatDefinition as FormatDefinition;
  const { sub_type } = formatDefinition as OldFormatDefinition;
  if (!format && !sub_type) {
    return Utils.friendlyNumber(numberValue);
  }
  const oldDefaultPattern = {
    pattern: '#,###0.00', groupSeparator: ',', decimalSeparator: '.',
  };
  const isDefaultPatternFormat = isEqual(format, oldDefaultPattern) || isEqual(format, { pattern: 'none' });
  const isDefaultFormat = format && (isDefaultPatternFormat || Object.keys(format).length === 0);
  if (isDefaultFormat || sub_type === 'auto') {
    return Utils.friendlyNumber(numberValue);
  }
  return formatValue(value, formatDefinition);
};
