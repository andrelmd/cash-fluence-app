import { TWhere } from "../types/where.type";

export interface ISelectOptions<TEntity> {
	table: string;
	where?: TWhere<TEntity>;
	limit?: number;
	offset?: number;
	orderBy?: string;
	groupBy?: string;
}
