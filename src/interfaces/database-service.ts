import { QueryResult } from "@tauri-apps/plugin-sql";
import { IDeleteOptions } from "../database/interfaces/delete-options.interface";
import { ISaveOptions } from "../database/interfaces/save-options.interface";
import { ISelectOptions } from "../database/interfaces/select-options.interface";
import { IUpdateOptions } from "../database/interfaces/update-options.interface";

export interface IDatabaseService {
	init(): Promise<void>;
	find<TEntity>(options: ISelectOptions<TEntity>): Promise<TEntity[]>;
	findOne<TEntity>(options: ISelectOptions<TEntity>): Promise<TEntity | null>;
	save<TEntity>(entity: ISaveOptions<TEntity>): Promise<QueryResult>;
	update<TEntity>(options: IUpdateOptions<TEntity>): Promise<void>;
	delete<TEntity>(options: IDeleteOptions<TEntity>): Promise<void>;
}
