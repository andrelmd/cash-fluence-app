import dayjs from "dayjs"
import { TSelectOptionsWithoutTable } from "../../database/types/select-options-without-table"
import { IEntityServiceDelete } from "../../interfaces/entity-service-delete"
import { IEntityServiceGetAll } from "../../interfaces/entity-service-get-all"
import { IEntityServiceGetMany } from "../../interfaces/entity-service-get-many"
import { IEntityServiceGetOne } from "../../interfaces/entity-service-get-one"
import { IEntityServiceSave } from "../../interfaces/entity-service-save"
import { IEntityServiceUpdate } from "../../interfaces/entity-service-update"
import { TransactionType } from "../../transactions/constants/transaction-type"
import { Recurrence } from "../entities/recurrence"
import { RecurrenceRepository } from "../entities/recurrence-repository"

export class RecurrencesService
	implements
		IEntityServiceDelete<Recurrence>,
		IEntityServiceSave<Recurrence>,
		IEntityServiceGetAll<Recurrence>,
		IEntityServiceGetOne<Recurrence>,
		IEntityServiceGetMany<Recurrence>,
		IEntityServiceUpdate<Recurrence>
{
	private repository: RecurrenceRepository

	constructor(repository: RecurrenceRepository) {
		this.repository = repository
	}
	async save(recurrence: Recurrence): Promise<Recurrence> {
		const result = await this.repository.save({ data: recurrence })
		const newRecurrence = await this.repository.getOne({ where: { id: result.lastInsertId } })

		if (!newRecurrence) {
			throw new Error("Recurrence not found")
		}

		return newRecurrence
	}

	async delete(recurrence: Recurrence): Promise<void> {
		return this.repository.delete({ where: { id: recurrence.id } })
	}

	async getAll(): Promise<Recurrence[]> {
		return this.getMany()
	}

	async getByType(type: TransactionType): Promise<Recurrence[]> {
		return this.getMany({ where: { type } })
	}

	async getOne(options: TSelectOptionsWithoutTable<Recurrence>): Promise<Recurrence | null> {
		return this.repository.getOne(options)
	}

	async getMany(options?: TSelectOptionsWithoutTable<Recurrence>): Promise<Recurrence[]> {
		return this.repository.getMany(options)
	}

	async update(recurrence: Recurrence): Promise<Recurrence> {
		await this.repository.update({ data: { ...recurrence, id: undefined }, where: { id: recurrence.id } })
		const updatedRecurrence = await this.repository.getOne({ where: { id: recurrence.id } })

		if (!updatedRecurrence) {
			throw new Error("Recurrence not found")
		}

		return updatedRecurrence
	}

	async getRecurrencesByPeriod(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs): Promise<Recurrence[]> {
		return this.getMany({
			where: {
				dueDate: {
					operator: "BETWEEN",
					value: [startDate, endDate],
				},
			},
			orderBy: {
				dueDate: "desc",
			},
		})
	}

	async getFirstYear() {
		const firstRecurrence = await this.getOne({
			orderBy: {
				dueDate: "asc",
			},
			limit: 1,
		})

		if (!firstRecurrence) {
			throw new Error("No recurrences found")
		}

		return dayjs(firstRecurrence.dueDate).year()
	}

	async getLastYear() {
		const lastRecurrence = await this.getOne({
			orderBy: {
				dueDate: "desc",
			},
			limit: 1,
		})

		if (!lastRecurrence) {
			throw new Error("No recurrences found")
		}

		return dayjs(lastRecurrence.dueDate).year()
	}

	async updateNextExecutionDate(id: number) {
		const recurrence = await this.getOne({ where: { id } })

		if (!recurrence) {
			throw new Error("Recurrence not found")
		}

		const nextExecutionDate = dayjs().add(1, "month").startOf("month").startOf("day")
		await this.update({ ...recurrence, nextExecutionDate })
	}
}
