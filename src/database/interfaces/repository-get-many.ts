import { ISelectOptions } from "./select-options";

export interface IRepositoryGetMany<TEntity> {
	getMany(options: ISelectOptions<TEntity>): Promise<TEntity[]>;
}
