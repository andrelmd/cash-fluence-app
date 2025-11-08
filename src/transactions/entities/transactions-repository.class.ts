import { QueryResult } from "@tauri-apps/plugin-sql";
import { IRepository } from "../../database/interfaces/repository.interface";
import { TDeleteOptionsWithoutTable } from "../../database/types/delete-options-without-table.type";
import { TSaveOptionsWithoutTable } from "../../database/types/save-options-without-table.type";
import { TSelectOptionsWithoutTable } from "../../database/types/select-options-without-table.type";
import { TUpdateOptionsWithoutTable } from "../../database/types/update-options-without-table.type";
import { IDatabaseService } from "../../interfaces/database-service.interface";
import { Transaction } from "./transaction";

export class TransactionsRepository implements IRepository<Transaction> {
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

	getAll(): Promise<Transaction[]> {
		return this.source.find<Transaction>({ table: this.table });
	}

	getOne(options: TSelectOptionsWithoutTable<Transaction>): Promise<Transaction | null> {
		return this.source.findOne<Transaction>({ table: this.table, ...options });
	}
}
