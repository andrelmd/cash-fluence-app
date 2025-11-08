import { TransactionType } from "../transactions/constants/transaction-type";
import { Transaction } from "../transactions/entities/transaction";

export function sumTransactionsByType(transactions: Transaction[], type: TransactionType): number {
	if (!transactions || !transactions.length) return 0;

	return transactions.filter((item) => item.type === type).reduce((acc, curr) => acc + curr.amount, 0);
}
