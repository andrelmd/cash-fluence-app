import { SqlOperators } from "../constants/sql-operators"
import { TEntityValue } from "../types/entity-value"
import { TWhereOperator } from "../types/where-operator"

/**
 * Creates a "greater than" condition for a query.
 * @example where: { amount: GreaterThan(100) }
 */
export function GreaterThan<TEntity>(value: TEntityValue<TEntity>): TWhereOperator<TEntity> {
	return { operator: SqlOperators.GREATER_THAN, value }
}

/**
 * Creates a "less than" condition for a query.
 * @example where: { amount: LessThan(100) }
 */
export function LessThan<TEntity>(value: TEntityValue<TEntity>): TWhereOperator<TEntity> {
	return { operator: SqlOperators.LESS_THAN, value }
}

/**
 * Creates a "less than or equal" condition for a query
 * @example where: { amount: LessThanOrEqual(100) }
 */
export function LessThanOrEqual<TEntity>(value: TEntityValue<TEntity>): TWhereOperator<TEntity> {
	return { operator: SqlOperators.LESS_THAN_OR_EQUAL, value }
}

/**
 * Creates a "greater than or equal" condition for a query.
 * @example where: { amount: GreaterThanOrEqual(100) }
 */
export function GreaterThanOrEqual<TEntity>(value: TEntityValue<TEntity>): TWhereOperator<TEntity> {
	return { operator: SqlOperators.GREATER_THAN_OR_EQUAL, value }
}

/**
 * Creates a "Between" condition for a query
 * @example where: {date: Between(yesterday, today)}
 */

export function Between<TEntity>(start: TEntityValue<TEntity>, end: TEntityValue<TEntity>): TWhereOperator<TEntity> {
	return { operator: SqlOperators.BETWEEN, value: [start, end] }
}
