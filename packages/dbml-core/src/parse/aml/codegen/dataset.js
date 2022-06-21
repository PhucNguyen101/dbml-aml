import { convertModelToDbmlRawTable } from './model';
import { convertRelationshipToDbmlRawRef } from './relationship';
import { escapeSpecialCharacter } from './utils';

export function convertDatasetToDbmlRawDB (dataset) {
  const { tables, fields } = dataset.data_models.reduce((acc, ele) => {
    const raw = convertModelToDbmlRawTable(ele);
    acc.tables.push(raw.table);
    acc.fields.push(...raw.fields);
    return acc;
  }, {
    tables: [],
    fields: [],
  });
  const res = {
    tables,
    fields,
    refs: dataset.raw_relationships.map(r => convertRelationshipToDbmlRawRef(r)),
    project: {
      name: dataset.name || 'undefined',
      note: escapeSpecialCharacter(dataset.description),
      /* A more complete solution is to update dbml model structure and add `data_source_name` property for Project element
      `description: ${dataset.description}
      data_source_name: ${dataset.data_source_name}`,
      */
    },
  };

  return res;
}
