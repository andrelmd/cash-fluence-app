import { QueryResult } from "@tauri-apps/plugin-sql"
import { IDatabaseService } from "../../database/interfaces/database-service"
import { IRepositoryDelete } from "../../database/interfaces/repository-delete"
import { IRepositoryGetMany } from "../../database/interfaces/repository-get-many"
import { IRepositoryGetOne } from "../../database/interfaces/repository-get-one"
import { IRepositorySave } from "../../database/interfaces/repository-save"
import { IRepositoryUpdate } from "../../database/interfaces/repository-update"
import { TDeleteOptionsWithoutTable } from "../../database/types/delete-options-without-table"
import { TSaveOptionsWithoutTable } from "../../database/types/save-options-without-table"
import { TSelectOptionsWithoutTable } from "../../database/types/select-options-without-table"
import { TUpdateOptionsWithoutTable } from "../../database/types/update-options-without-table"
import { Recurrence } from "./recurrence"

export class RecurrencesRepository
	implements
		IRepositoryDelete<Recurrence>,
		IRepositoryGetMany<Recurrence>,
		IRepositoryGetOne<Recurrence>,
		IRepositorySave<Recurrence>,
		IRepositoryUpdate<Recurrence>
{
	source: IDatabaseService
	table: string

	constructor(source: IDatabaseService, table: string) {
		this.source = source
		this.table = table
	}
	save(entity: TSaveOptionsWithoutTable<Recurrence>): Promise<QueryResult> {
		return this.source.save({ table: this.table, ...entity })
	}

	update(options: TUpdateOptionsWithoutTable<Recurrence>): Promise<void> {
		return this.source.update({ table: this.table, ...options })
	}
	delete(options: TDeleteOptionsWithoutTable<Recurrence>): Promise<void> {
		return this.source.delete({ table: this.table, ...options })
	}

	getMany(options?: TSelectOptionsWithoutTable<Recurrence>): Promise<Recurrence[]> {
		return this.source.find<Recurrence>({ table: this.table, ...options })
	}

	getOne(options: TSelectOptionsWithoutTable<Recurrence>): Promise<Recurrence | null> {
		return this.source.findOne<Recurrence>({ table: this.table, ...options })
	}
}
