import { Dayjs } from "dayjs"
import { TransactionType } from "../transactions/constants/transaction-type"
import { Transaction } from "../transactions/entities/transaction"
import { sumTransactionsByType } from "./transaction-calculations"

export interface IChartData {
	date: string
	projectedBalance: number
	realizedBalance: number
}

export const calculateDailyBalance = (transactions: Transaction[], month: Dayjs): IChartData[] => {
	if (!transactions || transactions.length === 0) {
		return []
	}

	const daysInMonth = month.daysInMonth()
	const chartData: IChartData[] = []

	// Não é mais necessário ordenar previamente, pois faremos dois loops separados

	let cumulativeProjectedBalance = 0
	let cumulativeRealizedBalance = 0

	for (let day = 1; day <= daysInMonth; day++) {
		const currentDate = month.date(day)

		const dailyProjectedTransactions = transactions.filter((transaction) =>
			transaction.dueDate.isSame(currentDate, "day")
		)
		const dailyProjectedIncome = sumTransactionsByType(dailyProjectedTransactions, TransactionType.INCOME)
		const dailyProjectedExpense = sumTransactionsByType(dailyProjectedTransactions, TransactionType.EXPENSE)
		cumulativeProjectedBalance += dailyProjectedIncome - dailyProjectedExpense

		const dailyRealizedTransactions = transactions.filter(
			(transaction) => transaction.paymentDate && transaction.paymentDate.isSame(currentDate, "day")
		)
		const dailyRealizedIncome = sumTransactionsByType(dailyRealizedTransactions, TransactionType.INCOME)
		const dailyRealizedExpense = sumTransactionsByType(dailyRealizedTransactions, TransactionType.EXPENSE)
		cumulativeRealizedBalance += dailyRealizedIncome - dailyRealizedExpense

		chartData.push({
			date: currentDate.format("DD/MM"),
			projectedBalance: cumulativeProjectedBalance,
			realizedBalance: cumulativeRealizedBalance,
		})
	}

	return chartData
}
