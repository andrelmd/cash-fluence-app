import { QueryResult } from "@tauri-apps/plugin-sql"
import { IDatabaseService } from "../../database/interfaces/database-service"
import { IRepositoryGetMany } from "../../database/interfaces/repository-get-many"
import { IRepositoryGetOne } from "../../database/interfaces/repository-get-one"
import { IRepositorySave } from "../../database/interfaces/repository-save"
import { IRepositoryUpdate } from "../../database/interfaces/repository-update"
import { TSaveOptionsWithoutTable } from "../../database/types/save-options-without-table"
import { TSelectOptionsWithoutTable } from "../../database/types/select-options-without-table"
import { TUpdateOptionsWithoutTable } from "../../database/types/update-options-without-table"
import { Planning } from "./planning"

export class PlanningRepository
	implements
		IRepositoryGetOne<Planning>,
		IRepositoryGetMany<Planning>,
		IRepositorySave<Planning>,
		IRepositoryUpdate<Planning>
{
	constructor(
		private source: IDatabaseService,
		private table: string
	) {}

	getOne(options: TSelectOptionsWithoutTable<Planning>): Promise<Planning | null> {
		return this.source.findOne<Planning>({ table: this.table, ...options })
	}

	save(options: TSaveOptionsWithoutTable<Planning>): Promise<QueryResult> {
		return this.source.save({ table: this.table, ...options })
	}

	update(options: TUpdateOptionsWithoutTable<Planning>): Promise<void> {
		return this.source.update({ table: this.table, ...options })
	}

	getMany(options?: TSelectOptionsWithoutTable<Planning>): Promise<Planning[]> {
		return this.source.find<Planning>({ table: this.table, ...options })
	}
}
