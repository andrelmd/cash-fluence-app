import { Category } from "../categories/entities/Category"
import { Planning } from "../plannings/entities/planning"
import { TransactionType } from "../transactions/constants/transaction-type"
import { Transaction } from "../transactions/entities/transaction"

export interface IProjectedVsRealizedData {
	category: string
	planned: number
	projected: number
	realized: number
	percentage: number
	color: string
}

export function calculateProjectedVsRealized(
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

		const planned = plannings?.find((p) => p.categoryId === category.id)?.amount || category.monthlyLimit || 0

		const projected = expenseTransactions
			.filter((t) => t.categoryId === category.id)
			.reduce((acc, curr) => acc + curr.amount, 0)

		const realized = expenseTransactions
			.filter((t) => t.categoryId === category.id)
			.filter((t) => t.paymentDate)
			.reduce((acc, curr) => acc + curr.amount, 0)

		acc.push({
			category: categoryName,
			planned,
			projected,
			realized,
			color: category.color,
			percentage: (projected / planned) * 100,
		})

		return acc
	}, [] as IProjectedVsRealizedData[])

	return chartData
}
