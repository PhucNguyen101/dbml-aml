import { Service } from '@holistics/aml';
import { getProject } from '@holistics/aml/lib/src/utils';
import { isAML } from '../utils';
import { loadHolisticsAMLDefinitionToProgram } from '../aml-std';
import { parseAMLFile } from '../parser';
import { convertDatasetToDbmlRawDB } from './dataset';

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

export function parseFromAml (datasetPath, rootPath) {
  const service = new Service();
  const { program } = service;
  loadHolisticsAMLDefinitionToProgram(program);

  initFileSystem(program, rootPath);

  const parseResult = parseAMLFile(service, datasetPath);

  // console.log(JSON.stringify(parseResult, null, 2));

  return convertDatasetToDbmlRawDB(parseResult.data);
}
