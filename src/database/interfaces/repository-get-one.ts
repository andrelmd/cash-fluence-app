import { TSelectOptionsWithoutTable } from "../types/select-options-without-table"

export interface IRepositoryGetOne<TEntity> {
	getOne(options: TSelectOptionsWithoutTable<TEntity>): Promise<TEntity | null>
}
