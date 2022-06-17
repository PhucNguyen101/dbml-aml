import { AmlObject } from '@holistics/aml/lib/src/interpreter/object_model';
import { TypeKind } from '@holistics/aml/lib/src/checker/types';
import { Ast, ImportDeclaration, SyntaxNodeKind } from '@holistics/aml/lib/src/types';
import { Program, Service } from '@holistics/aml';
import { v4 as uuid } from 'uuid';
import { forEachChild } from '@holistics/aml/lib/src/utils';
import { genCode } from '@holistics/aml/lib/src/tools/genCodeFromNode';
import { InterpretError, InterpretSuccess } from '../../types/type';


export const createValue = (type: string, value: unknown): { kind: SyntaxNodeKind, type: string, value: unknown } => {
  return {
    kind: SyntaxNodeKind.PrimaryExpression,
    type,
    value,
  };
};

export const createProperty = (kind: string, value: unknown): { kind: string, value: unknown } => {
  return {
    kind,
    value,
  };
};

export const generateSimpleAST = (program: Program, filePath: string): string | undefined => {
  const getJsonResult = program.serializePrettyJson(program.vfs.pathResolver.toVfsPath(filePath));
  if (getJsonResult.isOk()) {
    const jsonAST = getJsonResult.unwrap() as string;
    return JSON.parse(jsonAST);
  }
  return undefined;
};

export const generateSourceFromAst = (program: Program, jsonAST: string, filePath: string): string => {
  const asts = program.deserializePrettyJson(jsonAST);
  const src = genCode(asts.find(ast => ast && ast.filePath?.toString() === filePath) as Ast);
  return src;
};

export const modifyAst = (program: Program, filePath: string, modifyAstStrategy: any): string | null => {
  const ast = generateSimpleAST(program, filePath);
  if (ast) {
    const modifiedAST = modifyAstStrategy(ast);
    if (modifiedAST) {
      return generateSourceFromAst(program, JSON.stringify(modifiedAST), filePath);
    }
  }
  return null;
};

export const updateElement= ({ service }, {
  filePath,
  elementName,
  property,
  type,
  value,
}: {
  filePath: string,
  elementName: string,
  property: string,
  type: string,
  value: unknown
}): string => {
  const modelProperty = createProperty(
    'ElementProperty',
    createValue(type, value),
  );
  return modifyAst(service.program, filePath, (ast) => {
    ast[filePath].body[elementName].body[property] = modelProperty;
    return ast;
  }) as string;
};

export const validateReturnValueOfModelAndDataset = (returnVal: AmlObject, returnTypeName: string[]): boolean => {
  if (returnVal.type && returnVal.type.kind === TypeKind.ProductType) {
    if (returnTypeName.includes(returnVal.type.name)) {
      return true;
    }
  }
  return false;
};

export const createImportModule = (symbolName: string) => {
  return ({
    moduleName: {
      value: {
        value: symbolName,
      },
    },
  });
};

export const createImportNode = (filePath: string, symbolName: string) => {
  return ({
    id: `_import_${uuid()}_`,
    path: filePath,
    kind: 'ImportDeclaration',
    body: {
      modules: [createImportModule(symbolName)],
    },
  });
};

export const getImportNodesFromAst = (ast: Ast): ImportDeclaration[] => {
  const nodes: ImportDeclaration[] = [];
  forEachChild(ast, (node) => {
    if (node instanceof ImportDeclaration) {
      nodes.push(node);
    }
  });
  return nodes;
};

export const getRelativePath = (currentPath: string, path: string): string => {
  const currentPathParts = currentPath.split('/');
  const pathParts = path.split('/');
  const lastCurrentPathPartIndex = currentPathParts.length - 1;

  let i = 0;
  while (i < currentPathParts.length && i < pathParts.length && currentPathParts[i] === pathParts[i]) i += 1;

  const lastMatchedIndex = i - 1;
  if (lastMatchedIndex === lastCurrentPathPartIndex - 1) {
    return `./${pathParts.splice(lastMatchedIndex + 1).join('/')}`;
  }
  return '../'.repeat(lastCurrentPathPartIndex - lastMatchedIndex - 1) + pathParts.splice(lastMatchedIndex + 1).join('/');
};

export const createInfixExpressionNode = (leftExpression: unknown, operator: string, rightExpression: unknown): unknown => {
  return {
    kind: SyntaxNodeKind.InfixExpression,
    leftExpression,
    op: {
      value: operator,
    },
    rightExpression,
  };
};

export const createIdentifierNode = (value: string): unknown => {
  return {
    kind: SyntaxNodeKind.Identifier,
    value,
  };
};

export const createCallExpressionNode = (callee: unknown, args: unknown[]): unknown => {
  return {
    kind: SyntaxNodeKind.CallExpression,
    callee,
    args: {
      kind: SyntaxNodeKind.ArgumentList,
      value: args.map(arg => ({ kind: SyntaxNodeKind.ArgumentExpression, value: arg })),
    },
  };
};

export const createInterpretResultSuccess = <T> (data: T): InterpretSuccess<T> => {
  return {
    status: 'success',
    data,
  };
};

export const createInterpretResultError = (error: any): InterpretError => {
  return {
    status: 'error',
    error,
  };
};
