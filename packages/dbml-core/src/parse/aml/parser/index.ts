import { amlToModel } from "./amlToModel";
import { amlToDataset } from "./amlToDataset";
import { Service } from "@holistics/aml";
import { Dataset, InterpretResult, Model } from "../../types/type";

export const parseAMLFile = (service: Service, filePath: string): InterpretResult<Model | Dataset> | undefined => {
  if (filePath.endsWith('.model.aml')) {
    return amlToModel({ service}, { filePath});
  }
  if (filePath.endsWith('.dataset.aml')) {
    return amlToDataset({ service}, { filePath});
  }
};
