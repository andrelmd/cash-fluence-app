import { QueryResult } from "@tauri-apps/plugin-sql"
import { TUpsertOptionsWithoutTable } from "../types/upsert-options-without-table"

export interface IRepositoryUpsert<TEntity> {
	upsert(options: TUpsertOptionsWithoutTable<TEntity>): Promise<QueryResult>
}
