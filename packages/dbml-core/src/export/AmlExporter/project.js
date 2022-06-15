export function exportProject (database, normalizedDatabase, tableModels, relationships, dataSource) {
  const projectName = database.name || 'index';

  const modelImport = tableModels.map((m) => `import '../models/${m.name}.model.aml' { ${m.name} }`).join('\n');
  const modelDeclerationInner = tableModels.map((m) => `    ${m.name}`).join(',\n');

  const modelDecleration = `
  models: [
${modelDeclerationInner},
  ]
`;

  const relImport = relationships.map((r) => `import '../relationships/${r.name}.relationship.aml' { ${r.name} }`).join('\n');
  const relDeclerationInner = relationships.map((r) => `    RelationshipConfig {
      rel: ${r.name}
      active: true
    }
`).join(',\n');

  const relDecleration = `
  relationships: [
${relDeclerationInner},
  ]
`;


  const content = `
${modelImport}
${relImport}

Dataset ${projectName} {
  label: '${projectName}'
  description: '${database.note}'
  data_source_name: '${dataSource}'

${modelDecleration}

${relDecleration}
}
`;

  return { name: projectName, content };
}
