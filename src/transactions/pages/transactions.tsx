import { useCallback, useState } from "react"
import { Button } from "../../components/ui/button"
import { CardList } from "../../components/ui/card-list"
import { DateFilter } from "../../components/ui/date-filter"
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group"
import { usePeriodFilterContext } from "../../contexts/period-filter-context"
import { useFetchTransactions } from "../../hooks/use-fetch-transactions"
import { TransactionCard } from "../components/transaction-card"
import { TransactionForm } from "../components/transaction-form"
import { TransactionFilterType } from "../constants/transaction-filter-type"
import { Transaction } from "../entities/transaction"

export const Transactions = () => {
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [transaction, setTransaction] = useState<Transaction | null>(null)
	const [filterType, setFilterType] = useState<TransactionFilterType>(TransactionFilterType.ALL)
	const { startDate, endDate, date } = usePeriodFilterContext()

	const { data, isLoading } = useFetchTransactions({ startDate, endDate, filterType })

	const handleOnEdit = useCallback((transaction: Transaction) => {
		setTransaction(transaction)
		setIsFormOpen(true)
	}, [])

	const handleOnClose = useCallback(() => {
		setTransaction(null)
		setIsFormOpen(false)
	}, [])

	const handleOnOpen = useCallback(() => {
		setIsFormOpen(true)
	}, [])

	const handleFilterChange = (value: string) => {
		if (value) setFilterType(Number(value) as TransactionFilterType)
	}

	return (
		<>
			<div className="flex flex-1 flex-col gap-4 overflow-auto">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<DateFilter />
						<ToggleGroup
							type="single"
							value={filterType.toString()}
							onValueChange={handleFilterChange}
							className="border rounded-md"
						>
							<ToggleGroupItem value={TransactionFilterType.ALL.toString()} className="text-xs px-3">
								Todas
							</ToggleGroupItem>
							<ToggleGroupItem value={TransactionFilterType.DUE_DATE.toString()} className="text-xs px-3">
								Vencem
							</ToggleGroupItem>
							<ToggleGroupItem
								value={TransactionFilterType.CREATE_DATE.toString()}
								className="text-xs px-3"
							>
								Compras
							</ToggleGroupItem>
						</ToggleGroup>
					</div>

					<Button onClick={handleOnOpen}>Criar nova transação</Button>
				</div>
				<div className="overflow-auto flex-1 flex p-4">
					<CardList
						noContentText="Nenhuma transação encontrada"
						data={data}
						isLoading={isLoading}
						render={(item) => (
							<TransactionCard
								transaction={item}
								key={item.id}
								onEdit={handleOnEdit}
								filterDate={date}
								filterType={filterType}
							/>
						)}
					/>
				</div>
			</div>
			<TransactionForm
				transaction={transaction}
				open={isFormOpen}
				onOpenChange={setIsFormOpen}
				onClose={handleOnClose}
			/>
		</>
	)
}
