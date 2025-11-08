import { TWhereOperator } from "./where-operator.type";

export type TEntityValue<TEntity> =
	| Partial<TEntity[keyof TEntity]>
	| Partial<TEntity[keyof TEntity]>[]
	| TWhereOperator<TEntity>
	| undefined;
