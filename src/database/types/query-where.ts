import { TEntityValue } from "./entity-value";

export type TQueryWhere<TEntity> = { clause: string; values: TEntityValue<TEntity>[] };
