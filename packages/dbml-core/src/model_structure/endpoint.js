import Element from './element';
import { DEFAULT_SCHEMA_NAME } from './config';
import { shouldPrintSchema, shouldPrintSchemaName } from './utils';

class Endpoint extends Element {
  constructor ({
    tableName, schemaName, fieldNames, relation, token, ref,
  }) {
    super(token);
    this.relation = relation;

    this.schemaName = schemaName;
    this.tableName = tableName;
    this.fieldNames = fieldNames;
    this.fields = [];
    this.ref = ref;
    this.dbState = this.ref.dbState;
    this.generateId();
    // Use name of schema,table and field object
    // Name in constructor could be alias
    const schema = ref.schema.database.findOrCreateSchema(schemaName || DEFAULT_SCHEMA_NAME);

    const table = schema.database.findTable(schemaName, tableName);
    if (!table) {
      this.error(`Can't find table ${shouldPrintSchemaName(schemaName)
        ? `"${schemaName}".` : ''}"${tableName}"`);
    }
    this.setFields(fieldNames, table);
  }

  generateId () {
    this.id = this.dbState.generateId('endpointId');
  }

  equals (endpoint) {
    if (this.fields.length !== endpoint.fields.length) return false;
    return this.compareFields(endpoint);
  }

  compareFields (endpoint) {
    const sortedThisFieldIds = this.fields.map(field => field.id).sort();
    const sortedEndpointFieldIds = endpoint.fields.map(field => field.id).sort();
    for (let i = 0; i < sortedThisFieldIds.length; i += 1) {
      if (sortedThisFieldIds[i] !== sortedEndpointFieldIds[i]) return false;
    }
    return true;
  }

  export () {
    return {
      ...this.shallowExport(),
    };
  }

  exportParentIds () {
    return {
      refId: this.ref.id,
      fieldIds: this.fields.map(field => field.id),
    };
  }

  shallowExport () {
    return {
      schemaName: this.schemaName,
      tableName: this.tableName,
      fieldNames: this.fieldNames,
      relation: this.relation,
    };
  }

  setFields (fieldNames, table) {
    fieldNames.forEach(fieldName => {
      const field = table.findField(fieldName);
      if (!field) {
        this.error(`Can't find field ${shouldPrintSchema(table.schema)
          ? `"${table.schema.name}".` : ''}"${fieldName}" in table "${this.tableName}"`);
      }
      this.fields.push(field);
      field.pushEndpoint(this);
    });
  }

  normalize (model) {
    model.endpoints = {
      ...model.endpoints,
      [this.id]: {
        id: this.id,
        ...this.shallowExport(),
        ...this.exportParentIds(),
      },
    };
  }
}

export default Endpoint;
