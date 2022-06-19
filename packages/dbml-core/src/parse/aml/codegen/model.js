import { convertDimensionToDbmlRawField } from './dimension';

export function convertModelToDbmlRawTable (model) {
  const fields = model.dimensions.map(d => convertDimensionToDbmlRawField(d));
  const table = { };
  return { table, fields };
}
