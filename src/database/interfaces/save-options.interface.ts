export interface ISaveOptions<TEntity> {
	table: string;
	data: Partial<TEntity>;
	primaryKeys?: string[];
}
