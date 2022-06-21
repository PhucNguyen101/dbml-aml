import { convertDimensionToDbmlRawField } from './dimension';
import { escapeSpecialCharacter } from './utils';

export function convertModelToDbmlRawTable (model) {
  const fields = model.dimensions.map(d => convertDimensionToDbmlRawField(d));
  const table = {
    schema: 'public',
    name: model.name,
    note: escapeSpecialCharacter(model.description),
    owner: model.owner,
    data_source_name: model.data_source_id,
  };
  table.fields = fields;
  // console.log(JSON.stringify(table, null, 2));
  return { table, fields };
}
