import { Category } from "../categories/entities/Category"
import { Planning } from "../plannings/entities/planning"
import { TransactionType } from "../transactions/constants/transaction-type"
import { Transaction } from "../transactions/entities/transaction"

export interface IBalanceByCategoryChartData {
	type: string
	label: string
	data: Record<string, number>
	colors: Record<string, string>
}

export function calculateBalanceByCategories(
	transactions?: Transaction[],
	categories?: Category[],
	plannings?: Planning[]
) {
	if (!categories?.length || !transactions?.length) {
		return []
	}

	const expenseTransactions = transactions.filter((t) => t.type === TransactionType.EXPENSE)

	const planned: Record<string, number> = {}
	const actual: Record<string, number> = {}
	const monthlyLimit: Record<string, number> = {}
	const paid: Record<string, number> = {}
	const colors: Record<string, string> = {}

	categories.forEach((category) => {
		const categoryName = category.name

		planned[categoryName] = plannings?.find((p) => p.categoryId === category.id)?.amount || 0

		actual[categoryName] = expenseTransactions
			.filter((t) => t.categoryId === category.id)
			.reduce((acc, curr) => acc + curr.amount, 0)

		monthlyLimit[categoryName] = category.monthlyLimit || 0

		colors[categoryName] = `var(--${category.color})`

		paid[categoryName] = expenseTransactions
			.filter((t) => t.categoryId === category.id)
			.filter((t) => t.paymentDate)
			.reduce((acc, curr) => acc + curr.amount, 0)
	})

	const chartData: IBalanceByCategoryChartData[] = [
		{
			data: planned,
			type: "planned",
			label: "Planejado",
			colors,
		},
		{
			data: actual,
			type: "actual",
			label: "Realizado",
			colors,
		},
		{
			data: monthlyLimit,
			type: "limit",
			label: "Limite mensal",
			colors,
		},
		{
			data: paid,
			type: "paid",
			label: "Pago",
			colors,
		},
	]

	return chartData
}
