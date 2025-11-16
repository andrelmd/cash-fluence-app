import { Category } from "../categories/entities/Category"
import { TransactionType } from "../transactions/constants/transaction-type"
import { Transaction } from "../transactions/entities/transaction"

export interface IExpenseByCategoryChartData {
	category: string
	amount: number
	color: string
}

export function calculateExpensesByCategory(transactions?: Transaction[], categories?: Category[]) {
	if (!transactions || transactions.length === 0) {
		return []
	}

	if (!categories || categories.length === 0) {
		return []
	}

	return categories.map((category) => {
		const transactionsForCategory = transactions.filter((t) => t.categoryId === category.id)
		const amount = transactionsForCategory
			.filter((t) => t.type === TransactionType.EXPENSE)
			.reduce((acc, curr) => acc + curr.amount, 0)

		return {
			category: category.name,
			amount,
			color: `var(--${category.color})`,
		}
	}, [] as IExpenseByCategoryChartData[])
}
