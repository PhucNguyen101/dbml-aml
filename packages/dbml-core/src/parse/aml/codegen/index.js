import { Service } from '@holistics/aml';
import { getProject } from '@holistics/aml/lib/src/utils';
import { isAML } from '../utils';
import { loadHolisticsAMLDefinitionToProgram } from '../aml-std';
import { parseAMLFile } from '../parser';

const initFileSystem = (program, rootPath) => {
  const { pathResolver } = program.vfs;
  getProject(rootPath).forEach((content, filePath) => {
    if (isAML(filePath)) {
      program.setFileContent(pathResolver.toVfsPath(filePath), content);
    }
  });

  // vscode.workspace.textDocuments.forEach(({ uri }) => {
  //   openingAMLFiles.add(uri.path);
  // });
};

export function convertDatasetToDbmlRawDB (dataset) {
  return null;
}

export function parseFromAml (datasetPath, rootPath) {
  const service = new Service();
  const { program } = service;
  loadHolisticsAMLDefinitionToProgram(program);

  initFileSystem(program, rootPath);

  const dataset = parseAMLFile(service, datasetPath);

  console.log(JSON.stringify(dataset, null, 2));

  return convertDatasetToDbmlRawDB();
}
