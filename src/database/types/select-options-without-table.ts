import { ISelectOptions } from "../interfaces/select-options";

export type TSelectOptionsWithoutTable<TEntity> = Omit<ISelectOptions<TEntity>, "table">;
