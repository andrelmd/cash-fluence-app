import dayjs from "dayjs"
import { TSelectOptionsWithoutTable } from "../../database/types/select-options-without-table"
import { IEntityServiceDelete } from "../../interfaces/entity-service-delete"
import { IEntityServiceGetAll } from "../../interfaces/entity-service-get-all"
import { IEntityServiceGetMany } from "../../interfaces/entity-service-get-many"
import { IEntityServiceGetOne } from "../../interfaces/entity-service-get-one"
import { IEntityServiceSave } from "../../interfaces/entity-service-save"
import { IEntityServiceUpdate } from "../../interfaces/entity-service-update"
import { TransactionType } from "../constants/transaction-type"
import { Transaction } from "../entities/transaction"
import { TransactionsRepository } from "../entities/transactions-repository"

export class TransactionsService
	implements
		IEntityServiceDelete<Transaction>,
		IEntityServiceSave<Transaction>,
		IEntityServiceGetAll<Transaction>,
		IEntityServiceGetOne<Transaction>,
		IEntityServiceGetMany<Transaction>,
		IEntityServiceUpdate<Transaction>
{
	private repository: TransactionsRepository

	constructor(repository: TransactionsRepository) {
		this.repository = repository
	}
	async save(transaction: Transaction): Promise<Transaction> {
		const result = await this.repository.save({ data: transaction })
		const newTransaction = await this.repository.getOne({ where: { id: result.lastInsertId } })

		if (!newTransaction) {
			throw new Error("Transaction not found")
		}

		return newTransaction
	}

	async delete(transaction: Transaction): Promise<void> {
		return this.repository.delete({ where: { id: transaction.id } })
	}

	async getAll(): Promise<Transaction[]> {
		return this.getMany()
	}

	async getByType(type: TransactionType): Promise<Transaction[]> {
		return this.getMany({ where: { type } })
	}

	private createInstallmentTransaction(
		transaction: Transaction,
		currentInstallment: number,
		installmentNumber: number
	): Transaction {
		const { installments, amount, createDate } = transaction
		const installmentValue = amount / installments!
		const monthOffset = installmentNumber - currentInstallment
		const newCreateDate = dayjs(createDate).add(monthOffset, "month")

		return new Transaction({
			...transaction,
			paymentDate: null,
			currentInstallment: installmentNumber,
			amount: installmentValue,
			createDate: newCreateDate,
		})
	}

	async saveInInstallments(transaction: Transaction): Promise<Transaction[]> {
		const { installments, currentInstallment } = transaction
		if (!installments || !currentInstallment) {
			throw new Error("Transactions must have installments")
		}

		const transactionsToSave = Array.from({ length: installments - currentInstallment + 1 }, (_, i) =>
			this.createInstallmentTransaction(transaction, currentInstallment, i + currentInstallment)
		)

		return Promise.all(transactionsToSave.map((t) => this.save(t)))
	}

	async getOne(options: TSelectOptionsWithoutTable<Transaction>): Promise<Transaction | null> {
		return this.repository.getOne(options)
	}

	async getMany(options?: TSelectOptionsWithoutTable<Transaction>): Promise<Transaction[]> {
		return this.repository.getMany(options)
	}

	async update(transaction: Transaction): Promise<Transaction> {
		await this.repository.update({ data: { ...transaction, id: undefined }, where: { id: transaction.id } })
		const updatedTransaction = await this.repository.getOne({ where: { id: transaction.id } })

		if (!updatedTransaction) {
			throw new Error("Transaction not found")
		}

		return updatedTransaction
	}

	async getTransactionsByPeriod(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs): Promise<Transaction[]> {
		return this.getMany({
			where: {
				createDate: {
					operator: "BETWEEN",
					value: [startDate, endDate],
				},
			},
			orderBy: {
				createDate: "desc",
			},
		})
	}

	async getFirstYear() {
		const firstTransaction = await this.getOne({
			orderBy: {
				createDate: "asc",
			},
			limit: 1,
		})

		if (!firstTransaction) {
			throw new Error("No transactions found")
		}

		return dayjs(firstTransaction.createDate).year()
	}
}
