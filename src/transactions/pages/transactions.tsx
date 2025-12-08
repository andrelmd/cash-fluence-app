import dayjs from "dayjs"
import { useCallback, useMemo, useState } from "react"
import { ContentLayout } from "../../components/layouts/content-layout/content-layout"
import { Button } from "../../components/ui/button"
import { CardList } from "../../components/ui/card-list"
import { DateFilter } from "../../components/ui/date-filter"
import { useFetchTransactions } from "../../hooks/use-fetch-transactions"
import { TransactionCard } from "../components/transaction-card"
import { TransactionForm } from "../components/transaction-form"
import { Transaction } from "../entities/transaction"

export const Transactions = () => {
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [transaction, setTransaction] = useState<Transaction | null>(null)
	const [month, setMoth] = useState(dayjs().month())
	const [year, setYear] = useState(dayjs().year())

	const date = useMemo(() => dayjs().year(year).month(month), [month, year])
	const startDate = useMemo(() => date.startOf("month"), [date])
	const endDate = useMemo(() => date.endOf("month"), [date])

	const { query } = useFetchTransactions({ startDate, endDate })
	const { data, isLoading } = query

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
		<ContentLayout isLoading={isLoading}>
			<div className="flex flex-1 flex-col gap-4 overflow-auto">
				<div className="flex items-center justify-between">
					<DateFilter month={month} setMoth={setMoth} year={year} setYear={setYear} />

					<Button onClick={handleOnOpen}>Criar nova transação</Button>
				</div>
				<div className="overflow-auto flex-1 flex p-4">
					<CardList
						noContentText="Nenhuma transação encontrada"
						data={data}
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
		</ContentLayout>
	)
}
