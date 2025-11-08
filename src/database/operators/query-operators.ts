import { TEntityValue } from "../types/entity-value.type";
import { TWhereOperator } from "../types/where-operator.type";

/**
 * Creates a "greater than" condition for a query.
 * @example where: { amount: GreaterThan(100) }
 */
export function GreaterThan<TEntity>(value: TEntityValue<TEntity>): TWhereOperator<TEntity> {
	return { operator: ">", value };
}

/**
 * Creates a "less than" condition for a query.
 * @example where: { amount: LessThan(100) }
 */
export function LessThan<TEntity>(value: TEntityValue<TEntity>): TWhereOperator<TEntity> {
	return { operator: "<", value };
}

/**
 * Creates a "Between" condition for a query
 * @example where: {date: Between(yesterday, today)}
 */

export function Between<TEntity>(start: TEntityValue<TEntity>, end: TEntityValue<TEntity>): TWhereOperator<TEntity> {
	return { operator: "BETWEEN", value: [start, end] };
}
