import { ISaveOptions } from "../interfaces/save-options";

export type TSaveOptionsWithoutTable<TEntity> = Omit<ISaveOptions<TEntity>, "table">;
