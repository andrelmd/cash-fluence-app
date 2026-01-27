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
import { Transaction } from "./transaction"

export class TransactionRepository
	implements
		IRepositoryDelete<Transaction>,
		IRepositoryGetMany<Transaction>,
		IRepositoryGetOne<Transaction>,
		IRepositorySave<Transaction>,
		IRepositoryUpdate<Transaction>
{
	constructor(
		private readonly source: IDatabaseService,
		private readonly table: Tables
	) {}

	async save(entity: TSaveOptionsWithoutTable<Transaction>): Promise<QueryResult> {
		const { categoryIds, ...transactionData } = entity.data
		const result = await this.source.save({ table: this.table, data: transactionData as Transaction })

		if (categoryIds && categoryIds.length > 0) {
			await Promise.all(
				categoryIds.map((categoryId) =>
					this.source.save({
						table: Tables.TRANSACTION_CATEGORIES,
						data: { transactionId: result.lastInsertId, categoryId } as any,
					})
				)
			)
		}

		return result
	}

	async update(options: TUpdateOptionsWithoutTable<Transaction>): Promise<QueryResult> {
		const { categoryIds, ...transactionData } = options.data
		const result = await this.source.update({
			table: this.table,
			data: transactionData as Transaction,
			where: options.where,
		})

		const transactionId = options.where?.id as number
		if (transactionId && categoryIds !== undefined) {
			await this.source.delete({
				table: Tables.TRANSACTION_CATEGORIES,
				where: { transactionId } as any,
			})

			await Promise.all(
				categoryIds.map((categoryId) =>
					this.source.save({
						table: Tables.TRANSACTION_CATEGORIES,
						data: { transactionId, categoryId } as any,
					})
				)
			)
		}

		return result
	}

	delete(options: TDeleteOptionsWithoutTable<Transaction>): Promise<void> {
		return this.source.delete({ table: this.table, ...options })
	}

	async getMany(options?: TSelectOptionsWithoutTable<Transaction>): Promise<Transaction[]> {
		const transactions = await this.source.find<Transaction>({ table: this.table, ...options })
		const categories = await this.source.find<{ categoryId: number; transactionId: number }>({
			table: Tables.TRANSACTION_CATEGORIES,
			where: { transactionId: transactions.map((transaction) => transaction.id).filter((it) => it != null) },
		})

		return transactions.map((transaction) => {
			return new Transaction({
				...transaction,
				categoryIds: categories
					.filter((category) => category.transactionId === transaction.id)
					.map((category) => category.categoryId),
			})
		})
	}

	async getOne(options: TSelectOptionsWithoutTable<Transaction>): Promise<Transaction | null> {
		const transaction = await this.source.findOne<Transaction>({ table: this.table, ...options })

		if (!transaction) return null

		const categories = await this.source.find<{ categoryId: number; transactionId: number }>({
			table: Tables.TRANSACTION_CATEGORIES,
			where: { transactionId: transaction.id! },
		})

		return new Transaction({
			...transaction,
			categoryIds: categories.map((category) => category.categoryId),
		})
	}
}
