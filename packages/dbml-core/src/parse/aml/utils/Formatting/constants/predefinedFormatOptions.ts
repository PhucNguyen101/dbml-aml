import { DateTimeFormat } from '../utils/formatDate';
import { NumberPatternFormat } from '../utils/toNumberFormat';

export interface PredefinedFormatOption {
  label: string,
  format: NumberPatternFormat | DateTimeFormat | { sub_type: string },
  sample? : string,
}

export const NUMBER_FORMATS: PredefinedFormatOption[] = [
  { label: 'Inherited from Modeling', format: { pattern: 'inherited' } },
  { label: 'No format', format: { pattern: 'none' } },
  {
    label: 'Number (Rounded)',
    sample: '1,234',
    format: { pattern: '#,###' },
  },
  {
    label: 'Number (2 decimals)',
    sample: '1,234.12',
    format: { pattern: '#,###0.00' },
  },
  {
    label: 'Separator (Dot)',
    sample: '1.234.000,00',
    format: { pattern: '#,###0.00', groupSeparator: '.', decimalSeparator: ',' },
  },
  {
    label: 'Abbreviation (Million)',
    sample: '1,234,000 ⟶ 1,2M',
    format: { pattern: '#,###0.00,,"M"' },
  },
  {
    label: 'Abbreviation (Thousand)',
    sample: '1,234 ⟶ 1,2K',
    format: { pattern: '#,###0.00,"K"' },
  },
  {
    label: 'Percent (Rounded)',
    sample: '12 ⟶ 12%',
    format: { pattern: '#,###\\%' },
  },
  {
    label: 'Percent (Converted)',
    sample: '0.12 ⟶ 12%',
    format: { pattern: '#,###%' },
  },
  {
    label: 'Currency (Rounded)',
    sample: '$1,234',
    format: { pattern: '[$$]#,###' },
  },
  {
    label: 'Currency (2 decimals)',
    sample: '$1,234.12',
    format: { pattern: '[$$]#,###0.00' },
  },
];

export const DATE_FORMATS: PredefinedFormatOption[] = [
  { label: 'Default', format: { pattern: 'LLL dd yyyy' } },
  { label: '12/31/2020', format: { pattern: 'LL dd yyyy', separator: '/' } },
  { label: '31/12/2020', format: { pattern: 'dd LL yyyy', separator: '/' } },
  { label: 'Dec 31, 2020', format: { pattern: 'LLL dd, yyyy' } },
  { label: '31 Dec, 2020', format: { pattern: 'dd LLL, yyyy' } },
];
