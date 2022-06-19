import { convertModelToDbmlRawTable } from './model';
import { convertRelationshipToDbmlRawRef } from './relationship';

export function convertDatasetToDbmlRawDB (dataset) {
  const res = {
    tables: [],
    refs: [],
    project: {
      name: dataset.name || 'undefined',
      note: dataset.description,
      data_source_name: dataset.data_source_name, // not currently used by dbml
    },
  };

  return res;
}
