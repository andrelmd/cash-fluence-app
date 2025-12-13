import { useMemo } from "react"
import { usePeriodFilterContext } from "../contexts/period-filter-context"
import { calculateDailyBalance } from "../helpers/balance-chart-calculation"
import { calculateExpensesByCategory } from "../helpers/expenses-by-category-calculation"
import { calculatePaidByCategory } from "../helpers/paid-by-category-calculation"
import { calculateProjectedVsRealized } from "../helpers/projected-vs-realized-calculation"
import { useFetchCategories } from "./use-fetch-categories"
import { useFetchPlanningsByPeriod } from "./use-fetch-plannings-by-period"
import { useFetchTransactions } from "./use-fetch-transactions"

export const useDashboardData = () => {
	const { month, year, date, startDate, endDate } = usePeriodFilterContext()

	const { data: transactions, isLoading: isTransactionsLoading } = useFetchTransactions({ endDate, startDate })
	const { data: categories, isLoading: isCategoriesLoading } = useFetchCategories()
	const { data: plannings, isLoading: isPlanningsLoading } = useFetchPlanningsByPeriod({ month, year })

	const isLoading = isTransactionsLoading || isCategoriesLoading || isPlanningsLoading

	const balanceChartData = useMemo(() => calculateDailyBalance(transactions || [], date), [transactions, date])

	const expenseByCategoryData = useMemo(
		() => calculateExpensesByCategory(transactions, categories),
		[transactions, categories]
	)
	const projectedVsRealizedData = useMemo(
		() => calculateProjectedVsRealized(transactions, categories, plannings),
		[transactions, categories, plannings]
	)

	const paidByCategoryData = useMemo(
		() => calculatePaidByCategory(transactions, categories),
		[transactions, categories]
	)

	return {
		date,
		startDate,
		endDate,
		transactions,
		categories,
		plannings,
		isLoading,
		balanceChartData,
		expenseByCategoryData,
		projectedVsRealizedData,
		paidByCategoryData,
	}
}
