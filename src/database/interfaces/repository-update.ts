import { TUpdateOptionsWithoutTable } from "../types/update-options-without-table"

export interface IRepositoryUpdate<TEntity> {
	update(options: TUpdateOptionsWithoutTable<TEntity>): Promise<void>
}
