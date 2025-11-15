import { Category } from "../categories/entities/Category"
import { Planning } from "../plannings/entities/planning"
import { Transaction } from "../transactions/entities/transaction"

export interface IBalanceByCategoryChartData {
	category: string
	planned: number
	actual: number
	limit: number
}

export function calculateBalanceByCategories(
	transactions?: Transaction[],
	categories?: Category[],
	plannings?: Planning[]
) {
	if (!transactions || transactions.length === 0) {
		return []
	}

	if (!categories || categories.length === 0) {
		return []
	}

	if (!plannings || plannings.length === 0) {
		return []
	}

	const chartData: IBalanceByCategoryChartData[] = categories.map((category) => {
		const planning = plannings.find((p) => p.categoryId === category.id)

		const transactionsForCategory = transactions.filter((t) => t.categoryId === category.id)

		const planned = planning ? planning.amount : 0
		const actual = transactionsForCategory.reduce((acc, curr) => acc + curr.amount, 0)
		const limit = category.monthlyLimit ? category.monthlyLimit : 0

		return {
			category: category.name,
			planned,
			actual,
			limit,
		}
	}, [])

	return chartData
}
