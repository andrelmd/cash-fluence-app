import { ISelectOptions } from "./select-options";

export interface IRepositoryGetOne<TEntity> {
	getOne(options: ISelectOptions<TEntity>): Promise<TEntity | null>;
}
