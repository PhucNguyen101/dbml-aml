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
      owner: dataset.owner,
      data_source_name: dataset.data_source_name,
    },
  };

  return res;
}
