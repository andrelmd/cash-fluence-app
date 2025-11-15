import { IDeleteOptions } from "../interfaces/delete-options"

export type TDeleteOptionsWithoutTable<TEntity> = Omit<IDeleteOptions<TEntity>, "table">
