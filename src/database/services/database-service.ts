import { QueryResult } from "@tauri-apps/plugin-sql";
import { IDatabaseService } from "../../interfaces/database-service";
import { IDatabaseAdapter } from "../interfaces/database-adapter.interface";
import { IDeleteOptions } from "../interfaces/delete-options.interface";
import { ISaveOptions } from "../interfaces/save-options.interface";
import { ISelectOptions } from "../interfaces/select-options.interface";
import { IUpdateOptions } from "../interfaces/update-options.interface";

export class DatabaseService implements IDatabaseService {
	private databaseAdapter: IDatabaseAdapter;

	constructor(databaseAdapter: IDatabaseAdapter) {
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

	async update<TEntity>(options: IUpdateOptions<TEntity>): Promise<void> {
		return await this.databaseAdapter.update<TEntity>(options);
	}
}
