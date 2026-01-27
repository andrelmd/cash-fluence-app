import { TEntityValue } from "./entity-value"

export type TWhereCondition<TEntity> = {
	[key in keyof Partial<TEntity>]: TEntityValue<TEntity>
}

export type TWhere<TEntity> = TWhereCondition<TEntity> & {
	$or?: TWhereCondition<TEntity>[]
}
