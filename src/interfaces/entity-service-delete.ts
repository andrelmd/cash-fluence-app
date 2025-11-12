export interface IEntityServiceDelete<TEntity> {
	delete(entity: TEntity): Promise<void>;
}
