import { Option } from './currencyOptions';

export const THOUSAND = 'K';
export const MILLION = 'M';
export const BILLION = 'B';

export const ABBREVIATIONS: Option[] = [
  { label: 'None', value: '' },
  { label: 'Thousand', value: THOUSAND },
  { label: 'Million', value: MILLION },
  { label: 'Billion', value: BILLION },
];
