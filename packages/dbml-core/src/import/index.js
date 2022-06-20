import Parser from '../parse/Parser';
import ModelExporter from '../export/ModelExporter';

function _import (str, format) {
  const database = Parser.parse(str, format);
  const dbml = ModelExporter.export(database.normalize(), 'dbml');

  return dbml;
}

function _importV2 (str, format, options) {
  const database = Parser.parse(str, format, options);
  const dbml = ModelExporter.export(database.normalize(), 'dbml');

  return dbml;
}

export default {
  import: _import,
  importV2: _importV2,
};
