import { TDeleteOptionsWithoutTable } from "../types/delete-options-without-table"

export interface IRepositoryDelete<TEntity> {
	delete(options: TDeleteOptionsWithoutTable<TEntity>): Promise<void>
}
