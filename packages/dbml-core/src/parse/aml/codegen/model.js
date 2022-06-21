import { convertDimensionToDbmlRawField } from './dimension';
import { escapeSpecialCharacter } from './utils';

export function convertModelToDbmlRawTable (model) {
  const fields = model.dimensions.map(d => convertDimensionToDbmlRawField(d));
  const table = {
    schema: 'public',
    name: model.name,
    note: escapeSpecialCharacter(model.description),
    // A more complete solution is to update dbml model structure and add `data_source_name` and `owner_name` properties for Table element

  };
  table.fields = fields;
  // console.log(JSON.stringify(table, null, 2));
  return { table, fields };
}
