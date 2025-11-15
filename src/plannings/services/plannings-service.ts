import { TSelectOptionsWithoutTable } from "../../database/types/select-options-without-table"
import { IEntityServiceGetAll } from "../../interfaces/entity-service-get-all"
import { IEntityServiceGetMany } from "../../interfaces/entity-service-get-many"
import { IEntityServiceSave } from "../../interfaces/entity-service-save"
import { IEntityServiceUpdate } from "../../interfaces/entity-service-update"
import { Planning } from "../entities/planning"
import { PlanningRepository } from "../entities/planning-repository"

export class PlanningsService
	implements
		IEntityServiceGetMany<Planning>,
		IEntityServiceGetAll<Planning>,
		IEntityServiceSave<Planning>,
		IEntityServiceUpdate<Planning>
{
	constructor(private repository: PlanningRepository) {}

	async save(entity: Planning): Promise<Planning> {
		const result = await this.repository.save({ data: entity })

		const newPlanning = await this.repository.getOne({ where: { id: result.lastInsertId } })

		if (!newPlanning) {
			throw new Error("Planning not found")
		}

		return newPlanning
	}
	async update(entity: Partial<Planning>): Promise<Planning> {
		const { id, ...data } = entity

		if (!id) throw new Error("Planning id is required")

		await this.repository.update({ data, where: { id } })

		const updatedPlanning = await this.repository.getOne({ where: { id } })

		if (!updatedPlanning) {
			throw new Error("Planning not found")
		}

		return updatedPlanning
	}

	async getMany(options?: TSelectOptionsWithoutTable<Planning>): Promise<Planning[]> {
		return this.repository.getMany(options)
	}

	async getAll(): Promise<Planning[]> {
		return this.getMany()
	}

	async getByDate(month: number, year: number): Promise<Planning[]> {
		return this.getMany({ where: { month, year } })
	}
}
