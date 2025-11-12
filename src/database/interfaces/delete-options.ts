import { TWhere } from "../types/where";

export interface IDeleteOptions<TEntity> {
	table: string;
	where?: TWhere<TEntity>;
}
