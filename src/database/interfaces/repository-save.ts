import { QueryResult } from "@tauri-apps/plugin-sql";
import { ISaveOptions } from "./save-options";

export interface IRepositorySave<TEntity> {
	save(options: ISaveOptions<TEntity>): Promise<QueryResult>;
}
