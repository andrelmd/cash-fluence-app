import { QueryResult } from "@tauri-apps/plugin-sql";
import { DatabaseAdapter, IDeleteOptions, ISaveOptions, ISelectOptions } from "../types/database.types";

export class DatabaseService {
	private databaseAdapter: DatabaseAdapter;

	constructor(databaseAdapter: DatabaseAdapter) {
		this.databaseAdapter = databaseAdapter;
	}

	async init() {
		await this.databaseAdapter.init();
	}

	async find<TEntity>(options: ISelectOptions<TEntity>): Promise<TEntity[]> {
		return await this.databaseAdapter.find<TEntity>(options);
	}

	async save<TEntity>(entity: ISaveOptions<TEntity>): Promise<QueryResult> {
		return await this.databaseAdapter.save<TEntity>(entity);
	}

	async findOne<TEntity>(options: ISelectOptions<TEntity>): Promise<TEntity | null> {
		return await this.databaseAdapter.findOne<TEntity>(options);
	}

	async delete<TEntity>(options: IDeleteOptions<TEntity>): Promise<void> {
		return await this.databaseAdapter.delete<TEntity>(options);
	}
}
