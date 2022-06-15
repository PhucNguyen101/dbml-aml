import { shouldPrintSchema } from '../utils';
import { getFieldLines } from './field';


export function exportTable (tableId, model, dataSource) {
  const content = getFieldLines(tableId, model);
  const table = model.tables[tableId];
  const schema = model.schemas[table.schemaId];
  const nameSchema = `${shouldPrintSchema(schema, model) ? `${schema.name}.` : 'public'}`;
  const nameTable = `${nameSchema}_${table.name}`;
  let tableStr = ` Model ${nameTable} {\n`;
  tableStr += '  type: \'table\'\n';
  tableStr += `  label: "${table.name}"\n`;
  tableStr += `  description: ${table.note ? `'${table.note}'` : ''}\n`;
  tableStr += `  data_source_name: '${dataSource}'\n`;
  tableStr += `  table_name: '"${nameSchema}"."${table.name}"'\n`;
  tableStr += `${content.map(line => `  ${line}`).join('\n')}\n}\n\n\n`;
  return { name: nameTable, content: tableStr };
}
