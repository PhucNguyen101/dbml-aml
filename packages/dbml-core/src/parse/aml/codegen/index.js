import { Service } from "@holistics/aml";
import { isAML } from "../utils";
import { loadHolisticsAMLDefinitionToProgram } from '../aml-std';
import { getProject } from '@holistics/aml/lib/src/utils';

const initFileSystem = () => {
  const rootDir = process.cwd();
    vscode.workspace.workspaceFolders.forEach(({ uri }) => {
      getProject(uri.fsPath).forEach((content, filePath) => {
        if (isAML(filePath)) {
          program.setFileContent(pathResolver.toVfsPath(filePath), content);
        }
      });
    });
  }
  vscode.workspace.textDocuments.forEach(({ uri }) => {
    openingAMLFiles.add(uri.path);
  });
};

export function parseFromAml () {
  const service = new Service();
  const { program } = service;
  const pathResolver = program.vfs;
  loadHolisticsAMLDefinitionToProgram(program);
}
