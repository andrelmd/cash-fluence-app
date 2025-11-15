import { TOrderBy } from "../types/order-by"
import { TWhere } from "../types/where"

export interface ISelectOptions<TEntity> {
	table: string
	where?: TWhere<TEntity>
	limit?: number
	offset?: number
	orderBy?: TOrderBy<TEntity>
	groupBy?: string
}
