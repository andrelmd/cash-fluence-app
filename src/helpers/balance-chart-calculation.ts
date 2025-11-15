import { Dayjs } from "dayjs"
import { TransactionType } from "../transactions/constants/transaction-type"
import { Transaction } from "../transactions/entities/transaction"
import { sumTransactionsByType } from "./transaction-calculations"

export interface IChartData {
	date: string
	balance: number
}

export const calculateDailyBalance = (transactions: Transaction[], month: Dayjs): IChartData[] => {
	if (!transactions || transactions.length === 0) {
		return []
	}

	const daysInMonth = month.daysInMonth()
	const chartData: IChartData[] = []

	const sortedTransactions = [...transactions].sort((a, b) => a.dueDate.diff(b.dueDate))

	let cumulativeBalance = 0

	for (let day = 1; day <= daysInMonth; day++) {
		const currentDate = month.date(day)
		const dailyTransactions = sortedTransactions.filter((t) => t.dueDate.isSame(currentDate, "day"))

		const dailyIncome = sumTransactionsByType(dailyTransactions, TransactionType.INCOME)
		const dailyExpense = sumTransactionsByType(dailyTransactions, TransactionType.EXPENSE)
		const netChange = dailyIncome - dailyExpense

		cumulativeBalance += netChange

		chartData.push({ date: currentDate.format("DD/MM"), balance: cumulativeBalance })
	}

	return chartData
}
