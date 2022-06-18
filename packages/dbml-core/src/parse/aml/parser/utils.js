// convert with: https://www.typescriptlang.org/play#code/

import { TypeKind } from '@holistics/aml/lib/src/checker/types';
import { ImportDeclaration, SyntaxNodeKind } from '@holistics/aml/lib/src/types';
import { v4 as uuid } from 'uuid';
import { forEachChild } from '@holistics/aml/lib/src/utils';
import { genCode } from '@holistics/aml/lib/src/tools/genCodeFromNode';

export const createValue = (type, value) => {
  return {
    kind: SyntaxNodeKind.PrimaryExpression,
    type,
    value,
  };
};
export const createProperty = (kind, value) => {
  return {
    kind,
    value,
  };
};
export const generateSimpleAST = (program, filePath) => {
  const getJsonResult = program.serializePrettyJson(program.vfs.pathResolver.toVfsPath(filePath));
  if (getJsonResult.isOk()) {
    const jsonAST = getJsonResult.unwrap();
    return JSON.parse(jsonAST);
  }
  return undefined;
};
export const generateSourceFromAst = (program, jsonAST, filePath) => {
  const asts = program.deserializePrettyJson(jsonAST);
  const src = genCode(asts.find(ast => { let _a; return ast && ((_a = ast.filePath) === null || _a === void 0 ? void 0 : _a.toString()) === filePath; }));
  return src;
};
export const modifyAst = (program, filePath, modifyAstStrategy) => {
  const ast = generateSimpleAST(program, filePath);
  if (ast) {
    const modifiedAST = modifyAstStrategy(ast);
    if (modifiedAST) {
      return generateSourceFromAst(program, JSON.stringify(modifiedAST), filePath);
    }
  }
  return null;
};
export const updateElement = ({ service }, {
  filePath, elementName, property, type, value,
}) => {
  const modelProperty = createProperty('ElementProperty', createValue(type, value));
  return modifyAst(service.program, filePath, (ast) => {
    ast[filePath].body[elementName].body[property] = modelProperty;
    return ast;
  });
};
export const validateReturnValueOfModelAndDataset = (returnVal, returnTypeName) => {
  if (returnVal.type && returnVal.type.kind === TypeKind.ProductType) {
    if (returnTypeName.includes(returnVal.type.name)) {
      return true;
    }
  }
  return false;
};
export const createImportModule = (symbolName) => {
  return ({
    moduleName: {
      value: {
        value: symbolName,
      },
    },
  });
};
export const createImportNode = (filePath, symbolName) => {
  return ({
    id: `_import_${uuid()}_`,
    path: filePath,
    kind: 'ImportDeclaration',
    body: {
      modules: [createImportModule(symbolName)],
    },
  });
};
export const getImportNodesFromAst = (ast) => {
  const nodes = [];
  forEachChild(ast, (node) => {
    if (node instanceof ImportDeclaration) {
      nodes.push(node);
    }
  });
  return nodes;
};
export const getRelativePath = (currentPath, path) => {
  const currentPathParts = currentPath.split('/');
  const pathParts = path.split('/');
  const lastCurrentPathPartIndex = currentPathParts.length - 1;
  let i = 0;
  while (i < currentPathParts.length && i < pathParts.length && currentPathParts[i] === pathParts[i]) { i += 1; }
  const lastMatchedIndex = i - 1;
  if (lastMatchedIndex === lastCurrentPathPartIndex - 1) {
    return `./${pathParts.splice(lastMatchedIndex + 1).join('/')}`;
  }
  return '../'.repeat(lastCurrentPathPartIndex - lastMatchedIndex - 1) + pathParts.splice(lastMatchedIndex + 1).join('/');
};
export const createInfixExpressionNode = (leftExpression, operator, rightExpression) => {
  return {
    kind: SyntaxNodeKind.InfixExpression,
    leftExpression,
    op: {
      value: operator,
    },
    rightExpression,
  };
};
export const createIdentifierNode = (value) => {
  return {
    kind: SyntaxNodeKind.Identifier,
    value,
  };
};
export const createCallExpressionNode = (callee, args) => {
  return {
    kind: SyntaxNodeKind.CallExpression,
    callee,
    args: {
      kind: SyntaxNodeKind.ArgumentList,
      value: args.map(arg => ({ kind: SyntaxNodeKind.ArgumentExpression, value: arg })),
    },
  };
};
export const createInterpretResultSuccess = (data) => {
  return {
    status: 'success',
    data,
  };
};

export const createInterpretResultError = (error) => {
  return {
    status: 'error',
    error,
  };
};
