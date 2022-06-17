import { DateTimeFormat} from '../aml/utils/Formatting/utils/formatDate';
import { NumberPatternFormat } from '../aml/utils/Formatting/utils/toNumberFormat';

/* eslint-disable camelcase */
export type FieldValueType = 'number' | 'text' | 'date' | 'datetime' | 'duration' | 'truefalse' | 'composite' | 'binary';
export type FieldType = 'measure' | 'dimension';
export type ModelType = 'table' | 'query';

export type InterpretSuccess<T extends any> = {
  status: 'success',
  data: T
}

export type InterpretError = {
  status: 'error',
  error: any,
}

export type InterpretResult<T> = InterpretSuccess<T> | InterpretError;

export interface Field {
  name: string,
  label: string,
  custom_label?: string,
  type: FieldValueType,
  description: string,
  syntax: string,
  sql: string,
  is_hidden?: boolean,
  aggregation_type?: string,
  transform_type?: string
  is_custom?: boolean,
  is_custom_measure: boolean,
  model?: {
    id: number | string,
    name: string
  },
  is_external?: boolean,
  format?: NumberPatternFormat | DateTimeFormat
}

export interface Model {
  id: string,
  data_source_id: string,
  name: string,
  label?: string,
  description: string,
  source_type: ModelType,
  dimensions: Field[]
  measures: Field[],
  owner?: string
  relationship: Record<string, unknown>[],
  table_name?: string,
  query?: string,
  metadata?: Record<string, unknown>,
  data_source_name: string,
}

export type AMLDateFormat = string;

export type AMLNumberFormatSimple = string;

export type AMLNumberFormatFull = {
  pattern: string,
  groupSeparator?: '.' | ',' | ' ',
  decimalSeparator?: '.' | ',',
}

export type AMLNumberFormat = AMLNumberFormatSimple | AMLNumberFormatFull;

export type AMLFormat = AMLDateFormat | AMLNumberFormatSimple | AMLNumberFormatFull;

export interface AMLField {
  name: string,
  label: string,
  type: FieldValueType,
  hidden?: boolean,
  aggregation_type?: string,
  description?: string,
  definition: {
    name: string,
    content: string,
  },
  format?: AMLFormat
}

export interface AMLModel {
  id: string,
  name: string,
  type: ModelType,
  label?: string,
  description?: string,
  owner?: string,
  data_source_name: string,
  table_name?: string,
  query?: string,
  dimensions: AMLField[]
  measures: AMLField[]
}

export interface AMLFieldRef {
  model: string,
  field: string
}

export type RelationshipType = 'many_to_one' | 'one_to_one';

export interface AMLRelationship {
  id?: string,
  type: RelationshipType,
  from: AMLFieldRef,
  to: AMLFieldRef,
}

export interface AMLJoinConfig {
  rel: AMLRelationship,
  active: boolean,
  direction: string,
}

export interface AMLDataset {
  name: string,
  label: string,
  description: string,
  data_source_name: string,
  owner: string,
  models: AMLModel[],
  relationships: AMLJoinConfig[],
}

export interface FieldRef {
  model: Model,
  field: string
}

export interface Relationship {
  link_type: RelationshipType,
  source_model_id: string,
  dest_model_id: string,
  join_on: string,
  id: string,
}

export interface JoinConfig {
  join_id: string,
  active: boolean,
}

export interface Dataset {
  id: string,
  name: string,
  label: string,
  description: string,
  data_models: Model[],
  related_joins: Relationship[],
  join_configs: JoinConfig[],
  data_source_name: string,
  owner: string
}

export interface UpdateDatasetModels {
  modelName: string,
  filePath: string
}

export interface CurrentSelectedModel {
  importPath: string,
  modelName: string
}

export interface RelationshipInfo {
  sourceModelName: string,
  sourceDimensionName: string,
  destinationModelName: string,
  destinationDimensionName: string,
  linkType: 'many_to_one' | 'one_to_one' | 'one_to_many',
  isActive: boolean,
}

export interface EditFieldParams {
  filePath: string,
  modelName: string,
  field: Field,
  fieldType: FieldType
}
