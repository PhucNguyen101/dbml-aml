import { escapeSpecialCharacter } from '../utils';

export function exportProject (database, normalizedDatabase, tableModels, relationships, dataSource) {
  const projectName = database.name || 'index';

  const modelImport = tableModels.map((m) => `import '../${m.name}' { ${m.originalName} }`).join('\n');
  const modelDeclerationInner = tableModels.map((m) => `    ${m.originalName}`).join(',\n');

  const modelDecleration = `
  models: [
${modelDeclerationInner},
  ]
`;

  const relImport = relationships.map((r) => `import '../${r.name}' { ${r.originalName} }`).join('\n');
  const relDeclerationInner = relationships.map((r) => `    RelationshipConfig {
      rel: ${r.originalName}
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
  description: '${escapeSpecialCharacter(database.note)}'
  data_source_name: '${dataSource}'

${modelDecleration}

${relDecleration}
}
`;

  return { name: projectName, content };
}
