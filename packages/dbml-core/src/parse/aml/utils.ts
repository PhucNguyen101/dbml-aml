import * as path from 'path';

export const isAML = (filePath: string): boolean => {
  return path.extname(filePath) === '.aml';
};