import { QueryResult } from "@tauri-apps/plugin-sql"
import { Tables } from "../../database/constants/tables"
import { IDatabaseService } from "../../database/interfaces/database-service"
import { IRepositoryUpsert } from "../../database/interfaces/repository-upsert"
import { TUpsertOptionsWithoutTable } from "../../database/types/upsert-options-without-table"
import { Lock } from "./lock"

export class LockRepository implements IRepositoryUpsert<Lock> {
	constructor(
		private readonly source: IDatabaseService,
		private readonly table: Tables
	) {}

	async upsert(options: TUpsertOptionsWithoutTable<Lock>): Promise<QueryResult> {
		return await this.source.upsert<Lock>({ table: this.table, ...options })
	}
}
