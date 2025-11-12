export interface IEntityServiceGetAll<TEntity> {
	getAll(): Promise<TEntity[]>;
}
