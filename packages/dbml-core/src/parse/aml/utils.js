// convert with: https://www.typescriptlang.org/play#code/

import * as path from 'path';

export const isAML = (filePath) => {
  return path.extname(filePath) === '.aml';
};
