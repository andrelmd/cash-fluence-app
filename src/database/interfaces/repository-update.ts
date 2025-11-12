import { IUpdateOptions } from "./update-options";

export interface IRepositoryUpdate<TEntity> {
	update(options: IUpdateOptions<TEntity>): Promise<void>;
}
