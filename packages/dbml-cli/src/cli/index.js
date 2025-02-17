import program from 'commander';
import importHandler from './import';
import { exportHandler, amlExportHandler } from './export';
import projectInfo from '../../package.json';

function dbml2sql (args) {
  program.version(projectInfo.version);

  program
    .usage('[options] <files...>')
    .option('--mysql')
    .option('--postgres')
    .option('--mssql')
    .option('-o, --out-file <pathspec>', 'compile all input files into a single files');
  // .option('-d, --out-dir <pathspec>', 'compile an input directory of dbml files into an output directory');

  program.parse(args);

  exportHandler(program);
}

function sql2dbml (args) {
  program.version(projectInfo.version);

  program
    .usage('[options] <files...>')
    .option('--mysql')
    .option('--postgres')
    .option('--mssql')
    .option('-o, --out-file <pathspec>', 'compile all input files into a single files');
  // .option('-d, --out-dir <pathspec>', 'compile an input directory of sql files into an output directory');

  program.parse(args);

  importHandler(program);
};

function dbml2aml (args) {
  program.version(projectInfo.version);
  program
    .usage('[options] <files...>')
    .option('-o, --out-dir <pathspec>', 'compile an input files into an output directory')
    .option('-d, --data-source <pathspec>', 'specify datasource name, default is same name as project name');

  program.parse(args);
  amlExportHandler(program);
}

export {
  dbml2sql,
  sql2dbml,
  dbml2aml,
};
