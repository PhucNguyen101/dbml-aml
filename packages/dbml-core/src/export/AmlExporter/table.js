import { shouldPrintSchema } from '../utils';
import { getFieldLines } from './field';


export function exportTable (tableId, model, dataSource) {
  const content = getFieldLines(tableId, model);
  const table = model.tables[tableId];
  const schema = model.schemas[table.schemaId];
  const schemaName = `${shouldPrintSchema(schema, model) ? `${schema.name}.` : 'public'}`;
  const modelName = `${schemaName}_${table.name}`;
  let tableStr = ` Model ${modelName} {\n`;
  tableStr += '  type: \'table\'\n';
  tableStr += `  label: "${table.name}"\n`;
  tableStr += `  description: ${table.note ? `'${table.note}'` : ''}\n`;
  tableStr += `  data_source_name: '${dataSource}'\n`;
  tableStr += `  table_name: '"${schemaName}"."${table.name}"'\n`;
  tableStr += `${content.map(line => `  ${line}`).join('\n')}\n}\n\n\n`;
  return { name: modelName, content: tableStr };
}
