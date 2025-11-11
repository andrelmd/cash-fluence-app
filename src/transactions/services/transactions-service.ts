import dayjs from "dayjs";
import { TransactionType } from "../constants/transaction-type";
import { Transaction } from "../entities/transaction";
import { TransactionsRepository } from "../entities/transactions-repository";

export class TransactionsService {
	private repository: TransactionsRepository;

	constructor(repository: TransactionsRepository) {
		this.repository = repository;
	}
	async save(transaction: Transaction): Promise<Transaction> {
		const result = await this.repository.save({ data: transaction });
		const newTransaction = await this.repository.getOne({ where: { id: result.lastInsertId } });

		if (!newTransaction) {
			throw new Error("Transaction not found");
		}

		return newTransaction;
	}

	async delete(id: number): Promise<void> {
		return this.repository.delete({ where: { id } });
	}

	async getAll(): Promise<Transaction[]> {
		const result = await this.repository.getAll();
		const sortedResult = result.sort((a, b) => a.createDate.unix() - b.createDate.unix());
		return sortedResult;
	}

	async getByType(type: TransactionType): Promise<Transaction[]> {
		return this.repository.getMany({ where: { type } });
	}

	private createInstallmentTransaction(transaction: Transaction, installmentNumber: number): Transaction {
		const { installments, amount, createDate, description } = transaction;
		const installmentValue = amount / installments!;
		const newCreateDate = dayjs(createDate).add(installmentNumber, "month");

		return new Transaction({
			...transaction,
			description: `${description} - Parcela ${installmentNumber} de ${installments}`,
			currentInstallment: installmentNumber,
			amount: installmentValue,
			createDate: newCreateDate,
		});
	}

	async saveInInstallments(transaction: Transaction): Promise<Transaction[]> {
		const { installments, currentInstallment } = transaction;
		if (!installments || !currentInstallment) {
			throw new Error("Transactions must have installments");
		}

		const transactionsToSave: Transaction[] = [];
		for (let i = currentInstallment; i <= installments; i++) {
			const newTransaction = this.createInstallmentTransaction(transaction, i);
			transactionsToSave.push(newTransaction);
		}

		return Promise.all(transactionsToSave.map((t) => this.save(t)));
	}
}
