import { QueryResult } from "@tauri-apps/plugin-sql"
import { Tables } from "../../database/constants/tables"
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

export class RecurrenceRepository
	implements
		IRepositoryDelete<Recurrence>,
		IRepositoryGetMany<Recurrence>,
		IRepositoryGetOne<Recurrence>,
		IRepositorySave<Recurrence>,
		IRepositoryUpdate<Recurrence>
{
	constructor(
		private readonly source: IDatabaseService,
		private readonly table: Tables
	) {}

	async save(entity: TSaveOptionsWithoutTable<Recurrence>): Promise<QueryResult> {
		const { categoryIds, ...recurrenceData } = entity.data
		const result = await this.source.save({ table: this.table, data: recurrenceData as Recurrence })

		if (categoryIds && categoryIds.length > 0) {
			await Promise.all(
				categoryIds.map((categoryId) =>
					this.source.save({
						table: Tables.RECURRENCE_CATEGORIES,
						data: { recurrenceId: result.lastInsertId, categoryId } as any,
					})
				)
			)
		}

		return result
	}

	async update(options: TUpdateOptionsWithoutTable<Recurrence>): Promise<QueryResult> {
		const { categoryIds, ...recurrenceData } = options.data
		const result = await this.source.update({
			table: this.table,
			data: recurrenceData as Recurrence,
			where: options.where,
		})

		const recurrenceId = options.where?.id as number
		if (recurrenceId && categoryIds !== undefined) {
			await this.source.delete({
				table: Tables.RECURRENCE_CATEGORIES,
				where: { recurrenceId } as any,
			})

			await Promise.all(
				categoryIds.map((categoryId) =>
					this.source.save({
						table: Tables.RECURRENCE_CATEGORIES,
						data: { recurrenceId, categoryId } as any,
					})
				)
			)
		}

		return result
	}

	delete(options: TDeleteOptionsWithoutTable<Recurrence>): Promise<void> {
		return this.source.delete({ table: this.table, ...options })
	}

	async getMany(options?: TSelectOptionsWithoutTable<Recurrence>): Promise<Recurrence[]> {
		const recurrences = await this.source.find<Recurrence>({ table: this.table, ...options })
		const categories = await this.source.find<{ recurrenceId: number; categoryId: number }>({
			table: Tables.RECURRENCE_CATEGORIES,
			where: { recurrenceId: recurrences.map((recurrence) => recurrence.id).filter((id) => id !== null) },
		})

		return recurrences.map((recurrence) => {
			return new Recurrence({
				...recurrence,
				categoryIds: categories
					.filter((category) => category.recurrenceId === recurrence.id)
					.map((category) => category.categoryId),
			})
		})
	}

	async getOne(options: TSelectOptionsWithoutTable<Recurrence>): Promise<Recurrence | null> {
		const recurrence = await this.source.findOne<Recurrence>({ table: this.table, ...options })

		if (!recurrence) return null

		const categories = await this.source.find<{ recurrenceId: number; categoryId: number }>({
			table: Tables.RECURRENCE_CATEGORIES,
			where: { recurrenceId: recurrence.id! },
		})

		return new Recurrence({
			...recurrence,
			categoryIds: categories.map((category) => category.categoryId),
		})
	}
}
