import dayjs from "dayjs"
import { useMemo, useState } from "react"
import { ContentLayout } from "../../components/layouts/content-layout/content-layout"
import { DateFilter } from "../../components/ui/date-filter"
import { calculateBalanceByCategories } from "../../helpers/balance-by-category-calculation"
import { calculateDailyBalance } from "../../helpers/balance-chart-calculation"
import { calculateExpensesByCategory } from "../../helpers/expenses-by-category-calculation"
import { calculatePaidByCategory } from "../../helpers/paid-by-category-calculation"
import { calculatePlannedVsActual } from "../../helpers/planned-vs-actual-calculation"
import { sumTransactionsByType } from "../../helpers/transaction-calculations"
import { useFetchCategories } from "../../hooks/use-fetch-categories"
import { useFetchPlanningsByPeriod } from "../../hooks/use-fetch-plannings-by-period"
import { useFetchTransactions } from "../../hooks/use-fetch-transactions"
import { TransactionType } from "../../transactions/constants/transaction-type"
import { BalanceByCategoryChart } from "../components/balance-by-category-chart"
import { BalanceCard } from "../components/balance-card"
import { BalanceChart } from "../components/balance-chart"
import { CategoryExpenseCard } from "../components/category-expense-card"
import { ExpenseByCategoryChart } from "../components/expense-by-category-chart"
import { PaidByCategoryChart } from "../components/paid-by-category-chart"
import { PlannedVsActualChart } from "../components/planned-vs-actual-chart"

export const Dashboard = () => {
	const [month, setMoth] = useState(dayjs().month())
	const [year, setYear] = useState(dayjs().year())
	const date = useMemo(() => {
		return dayjs().month(month).year(year)
	}, [month, year])

	const startDate = useMemo(() => date.startOf("month"), [date])
	const endDate = useMemo(() => date.endOf("month"), [date])
	const { query } = useFetchTransactions({ endDate, startDate })
	const { data: transactions, isLoading } = query
	const { data: categories } = useFetchCategories()
	const { data: plannings } = useFetchPlanningsByPeriod({ month, year })

	const incomeSum = useMemo(() => sumTransactionsByType(transactions ?? [], TransactionType.INCOME), [transactions])
	const expenseSum = useMemo(() => sumTransactionsByType(transactions ?? [], TransactionType.EXPENSE), [transactions])
	const balance = useMemo(() => incomeSum - expenseSum, [incomeSum, expenseSum])

	const chartData = useMemo(() => calculateDailyBalance(transactions ?? [], date), [transactions, date])
	const byCategoryChartData = useMemo(
		() => calculateBalanceByCategories(transactions, categories, plannings),
		[transactions, categories, plannings]
	)

	const expenseByCategoryData = useMemo(
		() => calculateExpensesByCategory(transactions, categories),
		[transactions, categories]
	)
	const plannedVsActualData = useMemo(
		() => calculatePlannedVsActual(transactions, categories, plannings),
		[transactions, categories, plannings]
	)

	const paidByCategoryData = useMemo(
		() => calculatePaidByCategory(transactions, categories),
		[transactions, categories]
	)

	return (
		<ContentLayout isLoading={isLoading}>
			<div className="flex flex-1 flex-col gap-4 overflow-auto p-4">
				<div className="flex items-center justify-between">
					<DateFilter month={month} setMoth={setMoth} year={year} setYear={setYear} />
				</div>

				<div className="flex flex-1 flex-col gap-4 overflow-auto p-4">
					<div className="flex flex-row w-full justify-between gap-4">
						<BalanceCard type={TransactionType.INCOME} amount={incomeSum} date={date} />
						<BalanceCard type={TransactionType.EXPENSE} amount={expenseSum} date={date} />
						<BalanceCard amount={balance} date={date} />
					</div>
					<BalanceChart data={chartData} date={date} />
					<PlannedVsActualChart data={plannedVsActualData} date={date} />
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
						<BalanceByCategoryChart data={byCategoryChartData} date={date} />
						<PaidByCategoryChart data={paidByCategoryData} date={date} />
						<ExpenseByCategoryChart data={expenseByCategoryData} date={date} />
						<CategoryExpenseCard data={plannedVsActualData} date={date} />
					</div>
				</div>
			</div>
		</ContentLayout>
	)
}
