export interface IEntityServiceUpdate<TEntity> {
	update(entity: Partial<TEntity>): Promise<TEntity>
}
