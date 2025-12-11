import { IUpsertOptions } from "../interfaces/upsert-options"

export type TUpsertOptionsWithoutTable<TEntity> = Omit<IUpsertOptions<TEntity>, "table">
