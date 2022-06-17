import type { Callable } from '@holistics/aml/lib/src/interpreter/object_model';
import type { Expression, Program } from '@holistics/aml/lib/src/types';
import { InfixExpression } from '@holistics/aml/lib/src/types';
export declare function isRelExpr(relExpr: Expression): relExpr is InfixExpression;
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
export declare function expandRelMacro(program: Program): Callable;
