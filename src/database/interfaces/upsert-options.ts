import { TWhere } from "../types/where"

export interface IUpsertOptions<TEntity> {
	table: string
	data: Partial<TEntity>
	where?: TWhere<TEntity>
	conflictTarget: Array<keyof TEntity>
}
