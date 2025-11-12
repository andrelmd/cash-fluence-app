import { IDeleteOptions } from "./delete-options";

export interface IRepositoryDelete<TEntity> {
	delete(options: IDeleteOptions<TEntity>): Promise<void>;
}
