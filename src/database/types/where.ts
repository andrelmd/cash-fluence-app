import { TEntityValue } from "./entity-value"

export type TWhere<TEntity> = {
	[key in keyof Partial<TEntity>]: TEntityValue<TEntity>
}
