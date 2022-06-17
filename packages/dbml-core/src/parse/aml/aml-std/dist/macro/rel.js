"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandRelMacro = exports.isRelExpr = void 0;
var createDiagnostics_1 = require("@holistics/aml/lib/src/macros/createDiagnostics");
var diagnosticMessages_1 = require("@holistics/aml/lib/src/diagnostics/diagnosticMessages");
var utils_1 = require("@holistics/aml/lib/src/diagnostics/utils");
var object_model_1 = require("@holistics/aml/lib/src/interpreter/object_model");
var types_1 = require("@holistics/aml/lib/src/types");
var utils_2 = require("@holistics/aml/lib/src/utils");
function isRelExpr(relExpr) {
    return relExpr instanceof types_1.InfixExpression
        && relExpr.leftExpression instanceof types_1.InfixExpression
        && relExpr.leftExpression.leftExpression instanceof types_1.Identifier
        && relExpr.leftExpression.rightExpression instanceof types_1.Identifier
        && relExpr.rightExpression instanceof types_1.InfixExpression
        && relExpr.rightExpression.leftExpression instanceof types_1.Identifier
        && relExpr.rightExpression.rightExpression instanceof types_1.Identifier;
}
exports.isRelExpr = isRelExpr;
function validateRelMacroArgs(relExpr, active, direction, program) {
    if (!isRelExpr(relExpr) && !(relExpr instanceof types_1.Identifier))
        return [(0, createDiagnostics_1.createDiagnosticForOriginalNode)(relExpr, diagnosticMessages_1.DiagMessages.ExpectedThings, 'relationship expression: $model1.$field1 (>|-) $model2.$field2')];
    if (!(active instanceof types_1.PrimaryExpression) || (active.value.kind !== types_1.SyntaxTokenKind.TRUE_LITERAL && active.value.kind !== types_1.SyntaxTokenKind.FALSE_LITERAL))
        return [(0, createDiagnostics_1.createDiagnosticForOriginalNode)(active, diagnosticMessages_1.DiagMessages.ExpectedThings, 'boolean value')];
    if (direction) {
        if (!(direction instanceof types_1.PrimaryExpression) || (direction.value.value !== 'one_to_many' && direction.value.value !== 'two_way'))
            return [(0, createDiagnostics_1.createDiagnosticForOriginalNode)(direction, diagnosticMessages_1.DiagMessages.ExpectedThings, '\'one_to_many\' | \'two_way\'')];
    }
    return [];
}
/**
 * Parse and validate rel macro arguments
 */
function parseRelMacroArgs(macro, program, arg1, arg2, arg3) {
    var diags = [];
    if (!arg1 || !arg2)
        return new utils_2.Err([(0, createDiagnostics_1.createDiagnosticForOriginalNode)(macro.callee, diagnosticMessages_1.DiagMessages.ExpectedThings, '2 arguments: rel_expr, active')]);
    if (arg1.name || arg2.name || (arg3 && arg3.name)) { // handle case: rel(rel_expr: users.country_id > countries.id, active: true, direction: 'two_way')
        if (!arg1.name)
            diags.push((0, createDiagnostics_1.createDiagnosticForOriginalNode)(arg1.value, diagnosticMessages_1.DiagMessages.ExpectedThings, 'argument\'s name'));
        if (!arg2.name)
            diags.push((0, createDiagnostics_1.createDiagnosticForOriginalNode)(arg2.value, diagnosticMessages_1.DiagMessages.ExpectedThings, 'argument\'s name'));
        if (arg3 && !arg3.name)
            diags.push((0, createDiagnostics_1.createDiagnosticForOriginalNode)(arg3.value, diagnosticMessages_1.DiagMessages.ExpectedThings, 'argument\'s name'));
        var relExprArg = [arg1, arg2, arg3].find(function (arg) { var _a; return arg && ((_a = arg.name) === null || _a === void 0 ? void 0 : _a.value.value) === 'rel_expr'; });
        var activeArg = [arg1, arg2, arg3].find(function (arg) { var _a; return arg && ((_a = arg.name) === null || _a === void 0 ? void 0 : _a.value.value) === 'active'; });
        var directionArg = [arg1, arg2, arg3].find(function (arg) { var _a; return arg && ((_a = arg.name) === null || _a === void 0 ? void 0 : _a.value.value) === 'direction'; });
        if (!relExprArg)
            diags.push((0, createDiagnostics_1.createDiagnosticForOriginalNode)(macro.callee, diagnosticMessages_1.DiagMessages.MissingThings, 'argument: rel_expr'));
        if (!activeArg)
            diags.push((0, createDiagnostics_1.createDiagnosticForOriginalNode)(macro.callee, diagnosticMessages_1.DiagMessages.MissingThings, 'argument: active'));
        if (!(0, utils_1.emptyDiagnostics)(diags))
            return new utils_2.Err(diags);
        var relExpr_1 = relExprArg.value;
        var active_1 = activeArg.value;
        var direction_1 = directionArg && directionArg.value;
        diags = diags.concat(validateRelMacroArgs(relExpr_1, active_1, direction_1, program));
        if (!(0, utils_1.emptyDiagnostics)(diags))
            return new utils_2.Err(diags);
        return new utils_2.Ok({ relExpr: relExpr_1, active: active_1, direction: direction_1 });
    } // rel(users.country_id > countries.id, true, 'two_way')
    var relExpr = arg1.value;
    var active = arg2.value;
    var direction = arg3 ? arg3.value : undefined;
    diags = diags.concat(validateRelMacroArgs(relExpr, active, direction, program));
    if (!(0, utils_1.emptyDiagnostics)(diags))
        return new utils_2.Err(diags);
    return new utils_2.Ok({ relExpr: relExpr, active: active, direction: direction });
}
/**
 * Relationship macros for Holistics Data Model
 * Usage:
 *   rel(rel_expr: users.country_id > countries.id, active: true, direction: 'two_way') // with arguments names, order does not matter
 *   // or
 *   rel(active: true, direction: 'two_way', rel_expr: users.country_id > countries.id)
 *
 *   rel(users.country_id > countries.id, true, 'two_way') // without arguments name, order matters
 *
 *   // invalid
 *   rel(true, 'two_way', users.country_id > countries.id)
 */
function expandRelMacro(program) {
    return new object_model_1.JsFunc(function (macro, arg1, arg2, arg3) {
        var parseResult = parseRelMacroArgs(macro, program, arg1, arg2, arg3);
        if (parseResult.isErr())
            return new utils_2.DiagOk('null', parseResult.err());
        var _a = parseResult.unwrap(), relExpr = _a.relExpr, active = _a.active, direction = _a.direction;
        if (relExpr instanceof types_1.Identifier) {
            return new utils_2.DiagOk("RelationshipConfig {\n  rel: ".concat(relExpr.value.value, ",\n  active: ").concat(active.value.value, ",\n  ").concat(direction ? "direction: '".concat(direction.value.value, "'") : '', "\n}"));
        }
        return new utils_2.DiagOk("RelationshipConfig {\n  rel: Relationship {\n    type: ".concat(relExpr.op.value === '>' ? '\'many_to_one\'' : '\'one_to_one\'', "\n    from: FieldRef {\n      model: '").concat(relExpr.leftExpression.leftExpression.value.value, "',\n      field: '").concat(relExpr.leftExpression.rightExpression.value.value, "',\n    }\n    to: FieldRef {\n      model: '").concat(relExpr.rightExpression.leftExpression.value.value, "',\n      field: '").concat(relExpr.rightExpression.rightExpression.value.value, "',\n    }\n  },\n  active: ").concat(active.value.value, ",\n  ").concat(direction ? "direction: '".concat(direction.value.value, "'") : '', "\n}"));
    });
}
exports.expandRelMacro = expandRelMacro;
