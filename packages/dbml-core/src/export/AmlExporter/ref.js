import { shouldPrintSchema } from '../utils';

export function exportRef (refId, normalizedDatabase) {
  const ref = normalizedDatabase.refs[refId];
  const endPoint0 = normalizedDatabase.endpoints[ref.endpointIds[0]];
  const endPoint1 = normalizedDatabase.endpoints[ref.endpointIds[1]];
  const relationType = `${endPoint0.relation}${endPoint1.relation}`;

  let type = '';
  let [fromEndpoint, toEndpoint] = [endPoint0, endPoint1];
  switch (relationType) {
    case '11':
      type = 'one_to_one';
      break;
    case '1*':
      type = 'many_to_one';
      [fromEndpoint, toEndpoint] = [endPoint1, endPoint0];
      break;
    case '*1':
      type = 'many_to_one';
      break;
    case '**':
      throw Error('many-to-many relationships are not supported');
    default:
      throw Error(`unknown relationships type ${relationType}`);
  }

  const fromField = normalizedDatabase.fields[fromEndpoint.fieldIds[0]];
  const fromTable = normalizedDatabase.tables[fromField.tableId];
  const fromSchema = normalizedDatabase.schemas[fromTable.schemaId];

  const toField = normalizedDatabase.fields[toEndpoint.fieldIds[0]];
  const toTable = normalizedDatabase.tables[toField.tableId];
  const toSchema = normalizedDatabase.schemas[toTable.schemaId];

  // TODO: resolve edge case naming conflict
  // can't use ref.name because they aren't unique
  const name = `${fromSchema.name}_${fromTable.name}_${fromField.name}__${toSchema.name}_${toTable.name}_${toField.name}`;
  const fromSchemaName = `${shouldPrintSchema(fromSchema, normalizedDatabase) ? `${fromSchema.name}.` : 'public'}`;
  const toSchemaName = `${shouldPrintSchema(toSchema, normalizedDatabase) ? `${toSchema.name}.` : 'public'}`;

  const fromModelName = `${fromSchemaName}_${fromTable.name}`;
  const toModelName = `${toSchemaName}_${toTable.name}`;
  const content = `
Relationship ${name} {
  type: '${type}'
  from: ref('${fromModelName}', '${fromField.name}')
  to: ref('${toModelName}', '${toField.name}')
}
  `;

  return { name, content };
}
