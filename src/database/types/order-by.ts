export type TOrderBy<TEntity> = {
	[key in keyof Partial<TEntity>]: "asc" | "desc"
}
