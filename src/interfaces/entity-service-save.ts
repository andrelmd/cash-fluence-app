export interface IEntityServiceSave<TEntity> {
	save(entity: TEntity): Promise<TEntity>;
}
