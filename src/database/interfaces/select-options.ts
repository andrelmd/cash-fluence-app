import { TWhere } from "../types/where";

export interface ISelectOptions<TEntity> {
	table: string;
	where?: TWhere<TEntity>;
	limit?: number;
	offset?: number;
	orderBy?: string;
	groupBy?: string;
}
