export interface IEntityServiceUpdate<TEntity> {
	update(entity: TEntity): Promise<TEntity>;
}
