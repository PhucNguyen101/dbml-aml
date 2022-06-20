import { convertDimensionToDbmlRawField } from './dimension';

function shouldHaveSchema (modelName) {
  const nameArray = modelName.split('_');
  return {
    haveSchema: nameArray.length > 1,
    name: nameArray,
  };
}

export function convertModelToDbmlRawTable (model) {
  const fields = model.dimensions.map(d => convertDimensionToDbmlRawField(d));
  const { haveSchema, name } = shouldHaveSchema(model.name);
  const table = {
    schema: haveSchema ? name[0] : null,
    name: haveSchema ? name[1] : name[0],
    note: model.description,
    // A more complete solution is to update dbml model structure and add `data_source_name` and `owner_name` properties for Table element

  };
  table.fields = fields;
  // console.log(JSON.stringify(table, null, 2));
  return { table, fields };
}
