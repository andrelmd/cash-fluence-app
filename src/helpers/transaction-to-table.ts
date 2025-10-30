import { Transaction } from "../transactions/classes/transaction";
import { IData } from "../transactions/transaction-list";

export function transactionToTable(transactions: Transaction): IData {
	return {
		category: transactions.category,
		date: transactions.date,
		description: transactions.description,
		amount: transactions.amount,
		key: transactions.id,
	}
}