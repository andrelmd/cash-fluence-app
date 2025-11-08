import { TWhere } from "../types/where.type";

export interface IUpdateOptions<TEntity> {
	table: string;
	data: Partial<TEntity>;
	where?: TWhere<TEntity>;
}
