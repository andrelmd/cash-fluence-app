import { Category } from "../categories/entities/Category"
import { TransactionType } from "../transactions/constants/transaction-type"
import { Transaction } from "../transactions/entities/transaction"

export interface IExpenseRealizedByCategoryChartData {
	category: string
	projected: number
	realized: number
}

export function calculateExpenseRealizedByCategory(transactions?: Transaction[], categories?: Category[]) {
	if (!transactions || transactions.length === 0 || !categories || categories.length === 0) {
		return []
	}

	return categories
		.map((category) => {
			const transactionsForCategory = transactions.filter(
				(t) => t.categoryId === category.id && t.type === TransactionType.EXPENSE
			)

			if (transactionsForCategory.length === 0) return null

			const projected = transactionsForCategory.reduce((acc, curr) => acc + curr.amount, 0)
			const realized = transactionsForCategory
				.filter((t) => t.paymentDate)
				.reduce((acc, curr) => acc + curr.amount, 0)

			return {
				category: category.name,
				projected,
				realized,
			}
		})
		.filter(
			(item) => item !== null && (item.projected > 0 || item.realized > 0)
		) as IExpenseRealizedByCategoryChartData[]
}
