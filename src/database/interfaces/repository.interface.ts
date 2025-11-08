import { QueryResult } from "@tauri-apps/plugin-sql";
import { IDeleteOptions } from "./delete-options.interface";
import { ISaveOptions } from "./save-options.interface";
import { ISelectOptions } from "./select-options.interface";
import { IUpdateOptions } from "./update-options.interface";

export interface IRepository<TEntity> {
	getAll(): Promise<TEntity[]>;
	getOne(options: ISelectOptions<TEntity>): Promise<TEntity | null>;
	getMany(options: ISelectOptions<TEntity>): Promise<TEntity[]>;
	save(options: ISaveOptions<TEntity>): Promise<QueryResult>;
	update(options: IUpdateOptions<TEntity>): Promise<void>;
	delete(options: IDeleteOptions<TEntity>): Promise<void>;
}
