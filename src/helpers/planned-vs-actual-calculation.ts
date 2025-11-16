import { Category } from "../categories/entities/Category"
import { Planning } from "../plannings/entities/planning"
import { TransactionType } from "../transactions/constants/transaction-type"
import { Transaction } from "../transactions/entities/transaction"

export interface IPlannedVsActualData {
	category: string
	planned: number
	actual: number
	percentage: number
	color: string
}

export function calculatePlannedVsActual(
	transactions?: Transaction[],
	categories?: Category[],
	plannings?: Planning[]
) {
	if (!categories?.length || !transactions?.length) {
		return []
	}

	const expenseTransactions = transactions.filter((t) => t.type === TransactionType.EXPENSE)

	const chartData = categories.reduce((acc, category) => {
		const categoryName = category.name

		const planned = plannings?.find((p) => p.categoryId === category.id)?.amount || 0

		const actual = expenseTransactions
			.filter((t) => t.categoryId === category.id)
			.reduce((acc, curr) => acc + curr.amount, 0)

		acc.push({
			category: categoryName,
			planned,
			actual,
			color: category.color,
			percentage: (actual / planned) * 100,
		})

		return acc
	}, [] as IPlannedVsActualData[])

	return chartData
}
