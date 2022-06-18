// convert with: https://www.typescriptlang.org/play#code/

import { amlToModel } from "./amlToModel";
import { amlToDataset } from "./amlToDataset";

export const parseAMLFile = (service, filePath) => {
  if (filePath.endsWith('.model.aml')) {
    return amlToModel({ service }, { filePath });
  }
  if (filePath.endsWith('.dataset.aml')) {
    return amlToDataset({ service }, { filePath });
  }
};
