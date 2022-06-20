// convert with: https://www.typescriptlang.org/play#code/

import { map } from 'lodash';
import { createInterpretResultError, createInterpretResultSuccess, validateReturnValueOfModelAndDataset } from './utils';
import { convertAMLFormatToFormat } from './format';

export const convertAMLFieldtoField = (amlField, amlModel, fieldType) => {
  let _a;
  let _b;
  return {
    name: amlField.name,
    type: amlField.type,
    label: amlField.label,
    is_hidden: amlField.hidden,
    description: amlField.description || '',
    sql: ((_a = amlField.definition) === null || _a === void 0 ? void 0 : _a.content) || `{{ #SOURCE.${amlField.name} }}`,
    syntax: ((_b = amlField.definition) === null || _b === void 0 ? void 0 : _b.name) || 'sql',
    aggregation_type: amlField.aggregation_type,
    is_custom_measure: fieldType === 'measure',
    model: {
      id: amlModel.name,
      name: amlModel.name,
    },
    format: ((amlField.type === 'number' || amlField.type === 'date') && amlField.format) ? convertAMLFormatToFormat(amlField.type, amlField.format) : undefined,
  };
};
export const convertAMLModelToModel = (amlModel) => {
  return {
    id: amlModel.name,
    name: amlModel.name,
    source_type: amlModel.type,
    label: amlModel.label,
    description: amlModel.description || '',
    data_source_id: amlModel.data_source_name,
    owner: amlModel.owner || '',
    dimensions: map(amlModel.dimension, (field) => {
      return { ...convertAMLFieldtoField(field, amlModel, 'dimension') };
    }),
    table_name: amlModel.table_name || '',
    query: amlModel.query || '',
    data_source_name: amlModel.data_source_name,
    relationship: [],
    measures: map(amlModel.measure, (field) => {
      return { ...convertAMLFieldtoField(field, amlModel, 'measure') };
    }),
  };
};
export const amlToModel = ({ service }, { filePath }) => {
  try {
    const interpretResult = service.program.run(service.program.vfs.pathResolver.toVfsPath(filePath)).evalResult;
    if (interpretResult.isOk()) {
      const evalResult = interpretResult.unwrap();
      if (!validateReturnValueOfModelAndDataset(evalResult.returnVal, ['Model', 'TableModel', 'QueryModel'])) {
        return createInterpretResultError({ message: `${filePath}: File should return Model` });
      }
      const model = convertAMLModelToModel(evalResult.toJsStructure().returnVal);
      return createInterpretResultSuccess(model);
    }
    return createInterpretResultError(interpretResult.err());
  } catch (error) {
    return createInterpretResultError(error);
  }
};
