import { DateFilter } from "../../components/ui/date-filter"
import { useDashboardData } from "../../hooks/use-dashboard-data"
import { TransactionType } from "../../transactions/constants/transaction-type"
import { BalanceCard } from "../components/balance-card"
import { BalanceChart } from "../components/balance-chart"
import { CategoryExpenseCard } from "../components/category-expense-card"
import { ExpenseByCategoryChart } from "../components/expense-by-category-chart"
import { PaidByCategoryChart } from "../components/paid-by-category-chart"
import { PendingTransactionsTable } from "../components/pending-transactions-table"

export const Dashboard = () => {
	const {
		date,
		transactions,
		isLoading,
		balanceChartData,
		expenseByCategoryData,
		projectedVsRealizedData,
		paidByCategoryData,
	} = useDashboardData()

	return (
		<>
			<div className="flex flex-1 flex-col gap-4 overflow-auto p-4">
				<DateFilter />
				<div className="flex flex-1 flex-col gap-4 overflow-auto p-4">
					<div className="flex flex-row w-full justify-between gap-4">
						<BalanceCard
							type={TransactionType.INCOME}
							date={date}
							transactions={transactions}
							isLoading={isLoading}
						/>
						<BalanceCard
							type={TransactionType.EXPENSE}
							date={date}
							transactions={transactions}
							isLoading={isLoading}
						/>
						<BalanceCard date={date} transactions={transactions} isLoading={isLoading} />
					</div>
					<div className="flex flex-1 w-full">
						<BalanceChart data={balanceChartData} date={date} isLoading={isLoading} />
					</div>
					<div className="grid grid-cols-1 md:flex lg:grid-cols-2 gap-4 w-full">
						<PendingTransactionsTable />
						<CategoryExpenseCard data={projectedVsRealizedData} date={date} isLoading={isLoading} />
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
						<PaidByCategoryChart data={paidByCategoryData} date={date} isLoading={isLoading} />
						<ExpenseByCategoryChart data={expenseByCategoryData} date={date} isLoading={isLoading} />
					</div>
				</div>
			</div>
		</>
	)
}
