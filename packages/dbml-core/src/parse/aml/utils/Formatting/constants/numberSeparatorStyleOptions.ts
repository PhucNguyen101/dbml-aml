import { Option } from './currencyOptions';

export const NUMBER_SEPARATOR_STYLES: Option[] = [
  { label: '100 000,00', value: ' ,' },
  { label: '100 000.00', value: ' .' },
  { label: '100,000.00', value: ',.' },
  { label: '100.000,00', value: '.,' },
];
