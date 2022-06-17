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
  format?: any
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

export type FileError = Record<string, unknown>

export type GitProviderName = 'GitHub' | 'GitLab' | 'Other';
export interface GitProvider {
  domain: string
  rootUrl: string
  pathToRepo: string
  userName?: string,
  provider: GitProviderName
  transportProtocol: string
}

export enum ProjectMode {
  implicit = 'implicit',
  explicit = 'explicit'
}

export type Project = {
  id: number,
  name: string,
  tenantId?: number
  mode?: ProjectMode
  externalIntegrated: boolean,
  canIntegrateWithExternal: boolean,
  productionBranch: string,
}

export interface ProjectDetail extends Project {
  gitProvider: GitProvider,
}

export interface FileInfo {
  key: string,
  isDevelopment: boolean,
  filePath: string,
  content: string,
  editingContent: string,
  importFilePaths: string[],
  instance: unknown,
  branchName: string,
  projectId: number,
  oid: string,
}

type FileStatus = {
  isEditing: boolean,
  isValidating: boolean,
  isImportingFile: boolean,
  isSaving: boolean,
  isLoading: boolean,
}

type ParseInfo = {
  isParsing: boolean,
  previewModel?: Record<string, unknown>,
  errors?: FileError[],
}

export type NoConflictFile = {
  isConflict: false,
  conflictContent: null,
}
export type ConflictFile = {
  isConflict: true,
  shouldShowConflict: boolean,
  conflictContent: string,
};

export type File = FileInfo
  & FileStatus
  & (ConflictFile | NoConflictFile)
  & ParseInfo

export type FileUpdateParam = Partial<File>

export enum DBtype {
  postgresql = 'postgresql',
  redshift = 'redshift',
  mysql = 'mysql',
  voltdb = 'voltdb',
  bigquery = 'bigquery',
  sqlserver = 'sqlserver',
  mongodb = 'mongodb',
  prestodb = 'prestodb',
  qdspresto = 'qdspresto',
  pipedrive = 'pipedrive',
  facebook_ads = 'facebook_ads',
  qdshive = 'qdshive',
  oracledb = 'oracledb',
  aws_athena = 'aws_athena',
  enterprisedb = 'enterprisedb',
  snowflake = 'snowflake',
  clickhouse = 'clickhouse',
  google_analytics = 'google_analytics',
  sftp = 'sftp',
  adls2 = 'adls2',
  druid = 'druid',
  zendesk = 'zendesk'
}

export type Column = {
  column_name: string
  data_type: string
  table_fqname: string
}

export type Table = {
  name: string,
  columns?: Column[]
}

export type JobInfo = {
  id: number,
  created_at: Date,
  started_time: Date,
  end_time: Date,
  status: string,
}

export type SyncJob = {
  current_version?: { id: number },
  last_finish_job?: JobInfo,
  last_run_job?: JobInfo,
  isSyncing?: boolean,
}

type DataSourceSettings = {
  require_ssl: boolean
  query_timeout?: number
  default_schema: string
  enable_schema_info: boolean
  timezone: string
  use_connection_str: boolean
}

export type DataSource = {
  dbconfig?: Record<string, any>
  dbtype: DBtype
  id: number
  name: string
  settings: DataSourceSettings
  slug: string
  usage_count?:number
  use_reverse_tunnel: boolean
  is_default: boolean
  is_sample: boolean
  reverse_tunnel: null
  root_data_model_category_id: number,
}

export type Schema = {
  name: string,
  tables?: Table[]
}

export enum GitFileStatus {
  modified = 'modified',
  conflict = 'conflict',
  deleted = 'deleted',
  new = 'new'
}

export type GitFolderStatus = { [key in GitFileStatus]: boolean };

export type GitStatusItem = { filePath: string, status: GitFileStatus };
export type GitStatus = GitStatusItem[];

export enum CurrentBranchState {
  conflicted = 'conflicted',
  resolved = 'resolved',
  uncommitted = 'uncommitted',
  ahead_current = 'ahead_current',
  behind_current = 'behind_current',
  ahead_behind_current = 'ahead_behind_current',
  ahead_production = 'ahead_production',
  behind_production = 'behind_production',
  ahead_behind_production = 'ahead_behind_production',
  behind_deployed = 'behind_deployed',
  uptodate = 'uptodate',
  not_deployed = 'not_deployed',
}

export type BranchStatus = {
  ahead: number,
  behind: number,
}

export type CommitInfo = {
  oid: string,
  message: string,
  author: string,
  email: string,
  time: string
}

export type BranchDetail = {
  branchName: string,
  author: string,
  time: string,
}

export type CommitDetail = CommitInfo & {
  diff: string
};
