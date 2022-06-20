import path from 'path';
import importer from '../../src/import';

describe('@dbml/core - importer', () => {
  /**
   * @param {string} format = [json|mysql|postgres]
   */
  const runTest = (fileName, testDir, format) => {
    /* eslint-disable */
    const fileExtension = getFileExtension(format);
    const input = require(`./${testDir}/input/${fileName}.in.${fileExtension}`);
    const output = require(`./${testDir}/output/${fileName}.out.dbml`);
    const res = importer.import(input, format);

    expect(res).toBe(output);
    /* eslint-enable */
  };

  /* eslint-disable */
  test.each(scanTestNames(__dirname, 'json_importer/input'))('json_importer/%s', (name) => {
    runTest(name, 'json_importer', 'json');
  });

  test.each(scanTestNames(__dirname, 'mysql_importer/input'))('mysql_importer/%s', (name) => {
    runTest(name, 'mysql_importer', 'mysql');
  });

  test.each(scanTestNames(__dirname, 'postgres_importer/input'))('postgres_importer/%s', (name) => {
    runTest(name, 'postgres_importer', 'postgres');
  });

  test.each(scanTestNames(__dirname, 'mssql_importer/input'))('mssql_importer/%s', (name) => {
    runTest(name, 'mssql_importer', 'mssql');
  });
  /* eslint-enable */

  const runAmlTest = () => {
    /* eslint-disable */
    const rootPath = path.resolve(__dirname, './aml_importer');
    const datasetPath = path.resolve(rootPath, './datasets/index.dataset.aml');
    const output = require(`./aml_importer/out.dbml`);
    const res = importer.importV2('', 'aml', { datasetPath, rootPath });

    expect(res).toBe(output);
    /* eslint-enable */
  };

  test('aml to dbml test', runAmlTest);
});
