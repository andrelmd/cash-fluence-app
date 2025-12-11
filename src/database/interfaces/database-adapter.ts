import { QueryResult } from "@tauri-apps/plugin-sql"
import { IUpsertOptions } from "../interfaces/upsert-options"
import { IDeleteOptions } from "./delete-options"
import { ISaveOptions } from "./save-options"
import { ISelectOptions } from "./select-options"
import { IUpdateOptions } from "./update-options"

export interface IDatabaseAdapter {
	init(): Promise<void>
	find<TEntity>(options: ISelectOptions<TEntity>): Promise<TEntity[]>
	findOne<TEntity>(options: ISelectOptions<TEntity>): Promise<TEntity | null>
	save<TEntity>(entity: ISaveOptions<TEntity>): Promise<QueryResult>
	update<TEntity>(options: IUpdateOptions<TEntity>): Promise<QueryResult>
	delete<TEntity>(options: IDeleteOptions<TEntity>): Promise<void>
	upsert<TEntity>(options: IUpsertOptions<TEntity>): Promise<QueryResult>
}
