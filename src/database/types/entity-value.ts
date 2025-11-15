import { TWhereOperator } from "./where-operator"

export type TEntityValue<TEntity> =
	| Partial<TEntity[keyof TEntity]>
	| Partial<TEntity[keyof TEntity]>[]
	| TWhereOperator<TEntity>
	| undefined
