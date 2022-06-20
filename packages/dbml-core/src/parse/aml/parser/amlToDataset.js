// convert with: https://www.typescriptlang.org/play#code/

/* eslint-disable camelcase */
import { v4 as uuid } from 'uuid';
import { map, zipWith } from 'lodash';
import { ImportBody } from '@holistics/aml/lib/src/types';
import {
  createInterpretResultError, createInterpretResultSuccess, getImportNodesFromAst, validateReturnValueOfModelAndDataset,
} from './utils';
import { convertAMLModelToModel } from './amlToModel';

export const validateRelationship = (amlRelationships, dataModels) => {
  amlRelationships.forEach(amlRel => {
    const source_model = dataModels.find(model => model.name === amlRel.rel.from.model);
    const dest_model = dataModels.find(model => model.name === amlRel.rel.to.model);
    if (!source_model) {
      throw new Error(`Source model '${amlRel.rel.from.model}' not found`);
    }
    if (!dest_model) {
      throw new Error(`Destination model '${amlRel.rel.to.model}' not found`);
    }
  });
};
export const convertAMLRelationshipToRelationship = (amlRelationships = [], dataModels) => {
  validateRelationship(amlRelationships, dataModels);
  const relationships = amlRelationships.map(amlRel => {
    const source_model = dataModels.find(model => model.name === amlRel.rel.from.model);
    const dest_model = dataModels.find(model => model.name === amlRel.rel.to.model);
    return {
      id: uuid(),
      link_type: amlRel.rel.type,
      source_model_id: source_model.name,
      dest_model_id: dest_model.name,
      join_on: `\${SOURCE.${amlRel.rel.from.field}} = \${DEST.${amlRel.rel.to.field}}`,
    };
  });
  const joinConfigs = zipWith(amlRelationships, relationships, (amlRelationship, relationship) => ({
    join_id: relationship.id,
    active: amlRelationship.active,
  }));
  return { relationships, joinConfigs };
};
export const convertAMLDatasetToDataset = (amlDataset) => {
  const data_models = map(amlDataset.models, (model) => convertAMLModelToModel(model));
  const { relationships, joinConfigs } = convertAMLRelationshipToRelationship(amlDataset.relationships, data_models);
  return {
    id: amlDataset.name,
    name: amlDataset.name,
    label: amlDataset.label,
    description: amlDataset.description,
    data_models,
    related_joins: relationships,
    join_configs: joinConfigs,
    data_source_name: amlDataset.data_source_name,
    owner: amlDataset.owner || '',
    raw_relationships: amlDataset.relationships,
    raw_data_models: amlDataset.models,
  };
};
export const amlToDataset = ({ service }, { filePath }) => {
  try {
    const interpretResult = service.program.run(service.program.vfs.pathResolver.toVfsPath(filePath)).evalResult;
    if (interpretResult.isOk()) {
      const evalResult = interpretResult.unwrap();
      if (!validateReturnValueOfModelAndDataset(evalResult.returnVal, ['Dataset'])) {
        return createInterpretResultError({ message: `${filePath}: File should return Dataset` });
      }
      const dataset = convertAMLDatasetToDataset(evalResult.toJsStructure().returnVal);
      return createInterpretResultSuccess(dataset);
    }
    return createInterpretResultError(interpretResult.err());
  } catch (error) {
    return createInterpretResultError(error);
  }
};
export const getCurrentSelectedModelsFromDataset = ({ service }, { filePath }) => {
  const { program } = service;
  const { vfs } = program;
  const interpretResult = program.run(vfs.pathResolver.toVfsPath(filePath)).evalResult;
  if (interpretResult.isOk()) {
    const evalResult = interpretResult.unwrap();
    const dataset = convertAMLDatasetToDataset(evalResult.toJsStructure().returnVal);
    const ast = program.ast(vfs.pathResolver.toVfsPath(filePath)).unwrap().originalAst;
    const selectedModelNames = dataset.data_models.map(model => model.name);
    const modelNameAndPaths = [];
    const importNodes = getImportNodesFromAst(ast);
    importNodes.forEach(node => {
      const importPath = vfs.pathResolver.resolveAml(vfs.pathResolver.resolve(vfs.pathResolver.dirname(vfs.pathResolver.toVfsPath(filePath).toString()).toString(), node.path.value).toString());
      const modelNames = [];
      if (node.body instanceof ImportBody) {
        modelNames.push(...node.body.modules.map(module => module.moduleName.value.value));
      }
      modelNameAndPaths.push(...modelNames.map(modelName => ({ importPath: importPath.toString(), modelName })));
    });
    return modelNameAndPaths.filter(({ modelName }) => selectedModelNames.includes(modelName));
  }
  return [];
};
