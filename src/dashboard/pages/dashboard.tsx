import dayjs from "dayjs"
import { useMemo, useState } from "react"
import { ContentLayout } from "../../components/layouts/content-layout/content-layout"
import { Button } from "../../components/ui/button"
import { calculateBalanceByCategories } from "../../helpers/balance-by-category-calculation"
import { calculateDailyBalance } from "../../helpers/balance-chart-calculation"
import { sumTransactionsByType } from "../../helpers/transaction-calculations"
import { useFetchCategories } from "../../hooks/use-fetch-categories"
import { useFetchPlanningsByPeriod } from "../../hooks/use-fetch-plannings-by-period"
import { useFetchTransactions } from "../../hooks/use-fetch-transactions"
import { TransactionType } from "../../transactions/constants/transaction-type"
import { BalanceByCategoryChart } from "../components/balance-by-category-chart"
import { BalanceCard } from "../components/balance-card"
import { BalanceChart } from "../components/balance-chart"
import { DashboardFilterDialog } from "../components/dashboard-filter-dialog"

export const Dashboard = () => {
	const [month, setMoth] = useState(dayjs().month())
	const [year, setYear] = useState(dayjs().year())
	const [filterDialogIsOpen, setFilterDialogIsOpen] = useState(false)
	const date = useMemo(() => {
		return dayjs().month(month).year(year)
	}, [month, year])

	const startDate = useMemo(() => date.startOf("month"), [date])
	const endDate = useMemo(() => date.endOf("month"), [date])
	const { query } = useFetchTransactions({ endDate, startDate })
	const { data, isLoading } = query
	const { data: categories } = useFetchCategories()
	const { data: plannings } = useFetchPlanningsByPeriod({ month, year })

	const incomeSum = useMemo(() => sumTransactionsByType(data ?? [], TransactionType.INCOME), [data])
	const expenseSum = useMemo(() => sumTransactionsByType(data ?? [], TransactionType.EXPENSE), [data])
	const balance = useMemo(() => incomeSum - expenseSum, [incomeSum, expenseSum])

	const chartData = useMemo(() => calculateDailyBalance(data ?? [], date), [data, date])
	const byCategoryChartData = useMemo(
		() => calculateBalanceByCategories(data, categories, plannings),
		[data, categories, plannings]
	)

	return (
		<ContentLayout isLoading={isLoading}>
			<div className="flex flex-1 flex-col gap-4 overflow-auto">
				<div>
					<Button onClick={() => setFilterDialogIsOpen(true)}>Filtrar</Button>
				</div>

				<div className="flex flex-1 flex-col gap-4 overflow-auto">
					<div className="flex flex-row w-full justify-between gap-4">
						<BalanceCard type={TransactionType.INCOME} amount={incomeSum} date={date} />
						<BalanceCard type={TransactionType.EXPENSE} amount={expenseSum} date={date} />
						<BalanceCard amount={balance} date={date} />
					</div>
					<BalanceChart data={chartData} date={date} />
					<div className="grid grid-cols-2 gap-4 w-full">
						<BalanceByCategoryChart data={byCategoryChartData} date={date} />
					</div>
				</div>
			</div>
			<DashboardFilterDialog
				open={filterDialogIsOpen}
				onOpenChange={setFilterDialogIsOpen}
				month={month}
				setMoth={setMoth}
				year={year}
				setYear={setYear}
			/>
		</ContentLayout>
	)
}
