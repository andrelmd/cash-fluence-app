import { TSelectOptionsWithoutTable } from "../database/types/select-options-without-table";

export interface IEntityServiceGetMany<TEntity> {
	getMany(options: TSelectOptionsWithoutTable<TEntity>): Promise<TEntity[]>;
}
