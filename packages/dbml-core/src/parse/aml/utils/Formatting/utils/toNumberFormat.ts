import { get } from 'lodash';
import { NumberFormat, NumberStyle } from './formatNumber';

export interface NumberPatternFormat {
  pattern: string,
  decimalSeparator?: string,
  groupSeparator?: string,
}

interface MatchedGroup {
  index: number,
  groupPattern: string,
}

const retrieveCurrency = (pattern: string): string => {
  return pattern.replace('[$', '')
    .replace(']', '');
};

const parsePercentageOrAbbreviation = (pattern: string): NumberFormat => {
  switch (pattern) {
    case '%':
      return { percentageConvertible: true, numberStyle: NumberStyle.PERCENTAGE };
    case '\\%':
      return { numberStyle: NumberStyle.PERCENTAGE };
    default:
      // abbreviation is between "", e.g. ,"K"
      return { abbreviation: pattern.split(/[""]/)[1] };
  }
};

const parseMatchedGroups = (groups: MatchedGroup[]): NumberFormat => {
  let format: NumberFormat = {};
  groups.forEach(g => {
    const { groupPattern, index } = g;
    switch (index) {
      case 0: {
        format.numberStyle = NumberStyle.CURRENCY;
        format.prefix = retrieveCurrency(groupPattern);
        break;
      }
      case 1:
        format.decimalPlaces = format.decimalPlaces || 0; // no decimal specified e.g. # or #,# or ...
        break;
      case 2: {
        const decimalParts = groupPattern.split('.');
        format.decimalPlaces = get(decimalParts[1], 'length', 0);
        break;
      }
      case 3:
        format = {
          ...format,
          ...parsePercentageOrAbbreviation(groupPattern),
        };
        break;
      case 4: {
        format.numberStyle = NumberStyle.CURRENCY;
        format.suffix = retrieveCurrency(groupPattern);
        break;
      }
      default:
        break;
    }
  });

  return format;
};

export const toNumberFormat = (numberPatternFormat: NumberPatternFormat): NumberFormat => {
  const { pattern, decimalSeparator, groupSeparator } = numberPatternFormat;
  const patternRegex = /(\[\$.+\])?(#+(?:,#+)*)?(0*(?:\.0*))?(,"K"|,,"M"|,,,"B"|\\%|%)?(\s?\[\$.+\])?/g;
  if (pattern === 'none' || !pattern) {
    return {
      numberStyle: NumberStyle.NONE,
    };
  }
  const matches = [...pattern.matchAll(patternRegex)];
  const matchedGroups: MatchedGroup[] = matches[0] // always retreive the first match
    .map((groupPattern, index) => ({ groupPattern, index: index - 1 })) // full match indexed at 0, matches begin at 1
    .filter(({ groupPattern }) => groupPattern);
  matchedGroups.shift(); // remove the full match

  return {
    ...parseMatchedGroups(matchedGroups),
    decimalSeparator,
    groupSeparator,
  };
};
