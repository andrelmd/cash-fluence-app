import { TWhere } from "../types/where.type";

export interface IDeleteOptions<TEntity> {
	table: string;
	where?: TWhere<TEntity>;
}
