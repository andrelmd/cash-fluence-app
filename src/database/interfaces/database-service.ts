import { QueryResult } from "@tauri-apps/plugin-sql"
import { IDeleteOptions } from "./delete-options"
import { ISaveOptions } from "./save-options"
import { ISelectOptions } from "./select-options"
import { IUpdateOptions } from "./update-options"

export interface IDatabaseService {
	init(): Promise<void>
	find<TEntity>(options: ISelectOptions<TEntity>): Promise<TEntity[]>
	findOne<TEntity>(options: ISelectOptions<TEntity>): Promise<TEntity | null>
	save<TEntity>(entity: ISaveOptions<TEntity>): Promise<QueryResult>
	update<TEntity>(options: IUpdateOptions<TEntity>): Promise<void>
	delete<TEntity>(options: IDeleteOptions<TEntity>): Promise<void>
}
