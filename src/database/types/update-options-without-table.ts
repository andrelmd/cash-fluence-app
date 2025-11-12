import { IUpdateOptions } from "../interfaces/update-options";

export type TUpdateOptionsWithoutTable<TEntity> = Omit<IUpdateOptions<TEntity>, "table">;
