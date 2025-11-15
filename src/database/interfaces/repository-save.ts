import { QueryResult } from "@tauri-apps/plugin-sql"
import { TSaveOptionsWithoutTable } from "../types/save-options-without-table"

export interface IRepositorySave<TEntity> {
	save(options: TSaveOptionsWithoutTable<TEntity>): Promise<QueryResult>
}
