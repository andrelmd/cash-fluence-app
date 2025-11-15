import { TWhere } from "../types/where"

export interface IUpdateOptions<TEntity> {
	table: string
	data: Partial<TEntity>
	where?: TWhere<TEntity>
}
