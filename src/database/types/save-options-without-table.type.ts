import { ISaveOptions } from "../interfaces/save-options.interface";

export type TSaveOptionsWithoutTable<TEntity> = Omit<ISaveOptions<TEntity>, "table">;
