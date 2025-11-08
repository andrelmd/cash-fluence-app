import { TEntityValue } from "./entity-value.type";

export type TWhere<TEntity> = {
	[key in keyof Partial<TEntity>]: TEntityValue<TEntity>;
};
