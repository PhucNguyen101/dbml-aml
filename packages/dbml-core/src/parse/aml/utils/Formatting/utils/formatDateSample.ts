import { DateTimeFormat, formatDate } from './formatDate';

export default (format: DateTimeFormat): string => {
  return formatDate('December 31, 2020 03:24:00', format);
};
