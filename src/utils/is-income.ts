import { TransactionType } from "../transactions/constants/transaction-type"

export function isIncome(type: TransactionType | null) {
	return type === TransactionType.INCOME ? true : false
}
