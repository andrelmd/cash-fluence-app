import { ISelectOptions } from "../interfaces/select-options.interface";

export type TSelectOptionsWithoutTable<TEntity> = Omit<ISelectOptions<TEntity>, "table">;
