import { TSelectOptionsWithoutTable } from "../types/select-options-without-table"

export interface IRepositoryGetMany<TEntity> {
	getMany(options?: TSelectOptionsWithoutTable<TEntity>): Promise<TEntity[]>
}
