import { find, isNumber, isString } from 'lodash';
import { DateTime } from 'luxon';
import { parseZone } from 'moment';

type ISOFormat = 'iso';
type AdhocFormat = string;
interface ParseableFormat {
  luxonFormat: ISOFormat | AdhocFormat,
  pattern: RegExp,
  example: string
}

const PARSEABLE_FORMATS: ParseableFormat[] = [
  {
    luxonFormat: 'yyyy-LL-dd',
    pattern: new RegExp(/^\d{4}-\d{2}-\d{2}$/),
    example: '2021-12-31',
  },
  {
    luxonFormat: 'yyyy-LL-dd HH:mm:ss',
    pattern: new RegExp(/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/),
    example: '2021-12-31 21:00:00',
  },
  {
    luxonFormat: 'iso',
    pattern: new RegExp(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+\d{2}:\d{2}$/),
    example: '2021-11-03T05:01:38.280+08:00',
  },
];

const parseWithPredefinedFormats = (str: string): DateTime | null => {
  const formatter = find(PARSEABLE_FORMATS, (fmt) => fmt.pattern.test(str));

  if (!formatter) { return null; }

  let result = null;

  if (formatter.luxonFormat === 'iso') {
    // setZone: use the zone in the string if specified
    // zone: if no zone specified in the string, use this zone
    // These 2 options ensure no timezone conversion will happen
    // https://moment.github.io/luxon/api-docs/index.html
    result = DateTime.fromISO(str, { setZone: true, zone: 'Etc/UTC' });
  } else {
    result = DateTime.fromFormat(str, formatter.luxonFormat, { zone: 'Etc/UTC' });
  }

  return result.isValid ? result : null;
};

const parseStringToDate = (str: string): DateTime => {
  const parsedResult = parseWithPredefinedFormats(str);
  if (parsedResult) { return parsedResult; }
  
  const jsDate = new Date(str);
  return DateTime.fromJSDate(jsDate);
};

const luxonFrom = (value: Date | number | string): DateTime | null => {
  const opt = { zone: 'Etc/UTC' };
  let result = null;

  if (value instanceof Date) {
    result = DateTime.fromJSDate(value, opt);
  } else if (isNumber(value)) {
    result = DateTime.fromMillis(value, opt);
  } else if (isString(value)) {
    result = parseStringToDate(value);
  }

  return result?.isValid ? result : null;
};

const momentFromLuxon = (luxonInstance: DateTime | null): moment.Moment => {
  // return an invalid moment object instead of null
  if (!luxonInstance) { return window.moment.parseZone(null); }

  const isoString = luxonInstance.toISO();
  return (window.moment.parseZone as typeof parseZone)(isoString);
};

export { luxonFrom, momentFromLuxon };
