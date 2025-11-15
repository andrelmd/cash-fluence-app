import { TSelectOptionsWithoutTable } from "../database/types/select-options-without-table"

export interface IEntityServiceGetOne<TEntity> {
	getOne(options: TSelectOptionsWithoutTable<TEntity>): Promise<TEntity | null>
}
