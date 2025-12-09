import { useCallback, useState } from "react"
import { Button } from "../../components/ui/button"
import { CardList } from "../../components/ui/card-list"
import { DateFilter } from "../../components/ui/date-filter"
import { usePeriodFilterContext } from "../../contexts/period-filter-context"
import { useFetchTransactions } from "../../hooks/use-fetch-transactions"
import { TransactionCard } from "../components/transaction-card"
import { TransactionForm } from "../components/transaction-form"
import { Transaction } from "../entities/transaction"

export const Transactions = () => {
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [transaction, setTransaction] = useState<Transaction | null>(null)
	const { startDate, endDate } = usePeriodFilterContext()

	const { data, isLoading } = useFetchTransactions({ startDate, endDate })

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

	return (
		<>
			<div className="flex flex-1 flex-col gap-4 overflow-auto">
				<div className="flex items-center justify-between">
					<DateFilter />

					<Button onClick={handleOnOpen}>Criar nova transação</Button>
				</div>
				<div className="overflow-auto flex-1 flex p-4">
					<CardList
						noContentText="Nenhuma transação encontrada"
						data={data}
						isLoading={isLoading}
						render={(item) => <TransactionCard transaction={item} key={item.id} onEdit={handleOnEdit} />}
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
