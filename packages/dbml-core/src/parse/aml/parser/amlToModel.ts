import { EvalResult } from "@holistics/aml/lib/src/types";
import { InterpretResult } from "../typeAml/types";
import { AMLField, AMLModel, Field, FieldType, Model } from "../../types/type";
import { Service } from "@holistics/aml";
import { createInterpretResultError, createInterpretResultSuccess, validateReturnValueOfModelAndDataset } from "./utils";
import { convertAMLFormatToFormat } from "./format";
import { map } from "lodash";

export const convertAMLFieldtoField = (amlField: AMLField, amlModel: AMLModel, fieldType: FieldType): Field => {
  return {
    name: amlField.name,
    type: amlField.type,
    label: amlField.label,
    is_hidden: amlField.hidden,
    description: amlField.description || '',
    sql: amlField.definition?.content || `{{ #SOURCE.${amlField.name} }}`,
    syntax: amlField.definition?.name || 'sql',
    aggregation_type: amlField.aggregation_type,
    is_custom_measure: fieldType === 'measure',
    model: {
      id: amlModel.name,
      name: amlModel.name,
    },
    format: ((amlField.type === 'number' || amlField.type === 'date') && amlField.format) ? convertAMLFormatToFormat(amlField.type, amlField.format) : undefined,
  };
};

export const convertAMLModelToModel = (amlModel: AMLModel): Model => {
  return {
    id: amlModel.name,
    name: amlModel.name,
    source_type: amlModel.type,
    label: amlModel.label,
    description: amlModel.description || '',
    data_source_id: amlModel.data_source_name,
    owner: amlModel.owner || '',
    dimensions: map(amlModel.dimensions, (field) => {
      return {
        ...convertAMLFieldtoField(field, amlModel, 'dimension'),
      };
    }),
    table_name: amlModel.table_name || '',
    query: amlModel.query || '',
    data_source_name: amlModel.data_source_name,
    relationship: [],
    measures: map(amlModel.measures, (field) => {
      return {
        ...convertAMLFieldtoField(field, amlModel, 'measure'),
      };
    }),
  };
};

export const amlToModel = ({ service } : { service: Service}, { filePath }: { filePath: string }): InterpretResult<Model> => {
  try {
    const interpretResult = service.program.run(service.program.vfs.pathResolver.toVfsPath(filePath)).evalResult;
    if (interpretResult.isOk()) {
      const evalResult = interpretResult.unwrap() as EvalResult;
      if (!validateReturnValueOfModelAndDataset(evalResult.returnVal, ['Model', 'TableModel', 'QueryModel'])) {
        return createInterpretResultError({ message: `${filePath}: File should return Model` });
      }
      const model = convertAMLModelToModel((evalResult.toJsStructure() as any).returnVal);
      return createInterpretResultSuccess(model);
    }
    return createInterpretResultError(interpretResult.err());
  } catch (error) {
    return createInterpretResultError(error);
  }
};