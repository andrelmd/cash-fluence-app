import { TransactionType } from "../constants/transaction-type";
import { Transaction } from "../entities/transaction";
import { TransactionsRepository } from "../entities/transactions-repository.class";

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
		return this.repository.getAll();
	}

	async getByType(type: TransactionType): Promise<Transaction[]> {
		return this.repository.getMany({ where: { type } });
	}
}
