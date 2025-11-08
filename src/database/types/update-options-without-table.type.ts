import { IUpdateOptions } from "../interfaces/update-options.interface";

export type TUpdateOptionsWithoutTable<TEntity> = Omit<IUpdateOptions<TEntity>, "table">;
