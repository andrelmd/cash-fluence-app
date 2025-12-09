import { TransactionType } from "../transactions/constants/transaction-type"
import { Transaction } from "../transactions/entities/transaction"

interface CalculatedValues {
	realizedValue: number
	projectedValue: number
}

export const formatCurrency = (amount: number): string => {
	return amount.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	})
}

export const calculateBalanceCardValues = (
	transactions: Transaction[] | undefined,
	type: TransactionType | null
): CalculatedValues => {
	if (!transactions) {
		return {
			realizedValue: 0,
			projectedValue: 0,
		}
	}

	const incomes = transactions.filter((transaction) => transaction.type === TransactionType.INCOME)
	const expenses = transactions.filter((transaction) => transaction.type === TransactionType.EXPENSE)
	const sumAmounts = (txns: Transaction[]): number => txns.reduce((acc, curr) => acc + curr.amount, 0)
	const sumPaidAmounts = (txns: Transaction[]): number =>
		txns.filter((transaction) => transaction.paymentDate).reduce((acc, curr) => acc + curr.amount, 0)

	switch (type) {
		case TransactionType.INCOME:
			return {
				realizedValue: sumAmounts(incomes),
				projectedValue: sumPaidAmounts(incomes),
			}
		case TransactionType.EXPENSE:
			return {
				realizedValue: sumAmounts(expenses),
				projectedValue: sumPaidAmounts(expenses),
			}
		default:
			const realizedBalance = sumAmounts(incomes) - sumAmounts(expenses)
			const projectedBalance = sumPaidAmounts(incomes) - sumPaidAmounts(expenses)
			return {
				realizedValue: realizedBalance,
				projectedValue: projectedBalance,
			}
	}
}
