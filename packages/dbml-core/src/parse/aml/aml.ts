import { Service } from "@holistics/aml";
import { isAML } from "./utils";
import { loadHolisticsAMLDefinitionToProgram } from './aml-std';

export const service = new Service();
export const { program } = service;
export const { vfs: { pathResolver } } = program;
loadHolisticsAMLDefinitionToProgram(program);

// export const openingAMLFiles: Set<string> = new Set();

// export const openAMLFile = (filePath: string) => {
//   if (isAML(filePath)) {
//     openingAMLFiles.add(filePath);
//   }
// };

// export const closeAMLFile = (filePath: string) => openingAMLFiles.delete(filePath);
