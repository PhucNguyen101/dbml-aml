function shouldHaveSchema (modelName) {
  const nameArray = modelName.split('_');
  return {
    haveSchema: nameArray.length > 1,
    name: nameArray,
  };
}
function getRelations (type) {
  let relation = ['1', '1'];
  if (type === 'many_to_one') {
    relation = ['*', '1'];
  }
  return relation;
}
export function convertRelationshipToDbmlRawRef (relationship) {
  const schemaEndpoint1 = shouldHaveSchema(relationship.rel.from.model);
  const fieldNameEndpoind1 = [relationship.rel.from.field];

  const schemaEndpoint2 = shouldHaveSchema(relationship.rel.to.model);
  const fieldNameEndpoind2 = [relationship.rel.to.field];

  const relation = getRelations(relationship.rel.type);
  const endpoint1 = {
    schemaName: 'public',
    tableName: `${relationship.rel.from.model}`,
    fieldNames: fieldNameEndpoind1,
    relation: relation[0],
    token: null,
  };
  const endpoint2 = {
    schemaName: 'public',
    tableName: `${relationship.rel.to.model}`,
    fieldNames: fieldNameEndpoind2,
    relation: relation[1],
    token: null,
  };
  const endpoints = [endpoint1, endpoint2];
  const rel = {
    name: relationship.name,
    endpoints,
    token: null,
    schemaName: null,
  };
  return rel;
}
