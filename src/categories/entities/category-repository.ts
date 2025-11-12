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
import { Category } from "./Category";

export class CategoryRepository
	implements
		IRepositoryDelete<Category>,
		IRepositoryGetMany<Category>,
		IRepositoryGetOne<Category>,
		IRepositorySave<Category>,
		IRepositoryUpdate<Category>
{
	source: IDatabaseService;
	table: string;

	constructor(source: IDatabaseService, table: string) {
		this.source = source;
		this.table = table;
	}

	getOne(options: TSelectOptionsWithoutTable<Category>): Promise<Category | null> {
		return this.source.findOne<Category>({ table: this.table, ...options });
	}
	getMany(options: TSelectOptionsWithoutTable<Category> = {}): Promise<Category[]> {
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
