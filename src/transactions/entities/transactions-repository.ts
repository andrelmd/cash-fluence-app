import { QueryResult } from "@tauri-apps/plugin-sql";
import { IDatabaseService } from "../../database/interfaces/database-service";
import { IRepositoryDelete } from "../../database/interfaces/repository-delete";
import { IRepositoryGetMany } from "../../database/interfaces/repository-get-many";
import { IRepositoryGetOne } from "../../database/interfaces/repository-get-one";
import { IRepositorySave } from "../../database/interfaces/repository-save";
import { IRepositoryUpdate } from "../../database/interfaces/repository-update";
import { TDeleteOptionsWithoutTable } from "../../database/types/delete-options-without-table";
import { TSaveOptionsWithoutTable } from "../../database/types/save-options-without-table";
import { TSelectOptionsWithoutTable } from "../../database/types/select-options-without-table";
import { TUpdateOptionsWithoutTable } from "../../database/types/update-options-without-table";
import { Transaction } from "./transaction";

export class TransactionsRepository
	implements
		IRepositoryDelete<Transaction>,
		IRepositoryGetMany<Transaction>,
		IRepositoryGetOne<Transaction>,
		IRepositorySave<Transaction>,
		IRepositoryUpdate<Transaction>
{
	source: IDatabaseService;
	table: string;

	constructor(source: IDatabaseService, table: string) {
		this.source = source;
		this.table = table;
	}
	save(entity: TSaveOptionsWithoutTable<Transaction>): Promise<QueryResult> {
		return this.source.save({ table: this.table, ...entity });
	}

	update(options: TUpdateOptionsWithoutTable<Transaction>): Promise<void> {
		return this.source.update({ table: this.table, ...options });
	}
	delete(options: TDeleteOptionsWithoutTable<Transaction>): Promise<void> {
		return this.source.delete({ table: this.table, ...options });
	}

	getMany(options: TSelectOptionsWithoutTable<Transaction>): Promise<Transaction[]> {
		return this.source.find<Transaction>({ table: this.table, ...options });
	}

	getOne(options: TSelectOptionsWithoutTable<Transaction>): Promise<Transaction | null> {
		return this.source.findOne<Transaction>({ table: this.table, ...options });
	}
}
