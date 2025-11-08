import { QueryResult } from "@tauri-apps/plugin-sql";
import { IDeleteOptions } from "./delete-options.interface";
import { ISaveOptions } from "./save-options.interface";
import { ISelectOptions } from "./select-options.interface";
import { IUpdateOptions } from "./update-options.interface";

export interface IDatabaseAdapter {
	init(): Promise<void>;
	find<TEntity>(options: ISelectOptions<TEntity>): Promise<TEntity[]>;
	findOne<TEntity>(options: ISelectOptions<TEntity>): Promise<TEntity | null>;
	save<TEntity>(entity: ISaveOptions<TEntity>): Promise<QueryResult>;
	update<TEntity>(options: IUpdateOptions<TEntity>): Promise<void>;
	delete<TEntity>(options: IDeleteOptions<TEntity>): Promise<void>;
}
