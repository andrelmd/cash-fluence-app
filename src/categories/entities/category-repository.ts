import { QueryResult } from "@tauri-apps/plugin-sql";
import { IRepository } from "../../database/interfaces/repository.interface";
import { TDeleteOptionsWithoutTable } from "../../database/types/delete-options-without-table.type";
import { TSaveOptionsWithoutTable } from "../../database/types/save-options-without-table.type";
import { TSelectOptionsWithoutTable } from "../../database/types/select-options-without-table.type";
import { TUpdateOptionsWithoutTable } from "../../database/types/update-options-without-table.type";
import { IDatabaseService } from "../../interfaces/database-service.interface";
import { Category } from "./Category";

export class CategoryRepository implements IRepository<Category> {
	source: IDatabaseService;
	table: string;

	constructor(source: IDatabaseService, table: string) {
		this.source = source;
		this.table = table;
	}

	getAll(): Promise<Category[]> {
		return this.source.find<Category>({ table: this.table });
	}
	getOne(options: TSelectOptionsWithoutTable<Category>): Promise<Category | null> {
		return this.source.findOne<Category>({ table: this.table, ...options });
	}
	getMany(options: TSelectOptionsWithoutTable<Category>): Promise<Category[]> {
		return this.source.find<Category>({ table: this.table, ...options });
	}
	save(options: TSaveOptionsWithoutTable<Category>): Promise<QueryResult> {
		return this.source.save({ table: this.table, ...options });
	}
	update(options: TUpdateOptionsWithoutTable<Category>): Promise<void> {
		return this.source.update({ table: this.table, ...options });
	}
	delete(options: TDeleteOptionsWithoutTable<Category>): Promise<void> {
		return this.source.delete({ table: this.table, ...options });
	}
}
