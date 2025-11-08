import { IDeleteOptions } from "../interfaces/delete-options.interface";

export type TDeleteOptionsWithoutTable<TEntity> = Omit<IDeleteOptions<TEntity>, "table">;
