import { Dayjs } from "dayjs"
import { TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { useMemo } from "react"
import { Card, CardContent, CardHeader } from "../../components/ui/card"
import { TransactionType } from "../../transactions/constants/transaction-type"

interface ITransactionSummaryCardProps {
	type?: TransactionType | null
	amount: number
	date: Dayjs
}

export const BalanceCard = ({ amount, type, date }: ITransactionSummaryCardProps) => {
	const title = useMemo(() => {
		switch (type) {
			case TransactionType.INCOME:
				return "Entradas"
			case TransactionType.EXPENSE:
				return "Saídas"
			default:
				return "Saldo"
		}
	}, [type])

	const icon = useMemo(() => {
		switch (type) {
			case TransactionType.INCOME:
				return <TrendingUp />
			case TransactionType.EXPENSE:
				return <TrendingDown />
			default:
				return <Wallet />
		}
	}, [type])

	const value = amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

	const isNegative = amount < 0

	return (
		<Card className="flex flex-1">
			<CardHeader>
				<div className="flex flex-row justify-between items-center text-xl">
					{title}
					<div
						data-type={type}
						className=" data-[type=0]:text-green-400 data-[type=1]:text-red-400 not-[data-type]:text-blue-400 dark:data-[type=0]:text-green-300 dark:data-[type=1]:text-red-300 dark:not-[data-type]:text-blue-300"
					>
						{icon}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div
					data-type={type}
					data-negative={isNegative}
					className="font-bold data-[type=0]:text-green-400 data-[type=1]:text-red-400 dark:data-[type=0]:text-green-300 dark:data-[type=1]:text-red-300 text-xl data-[negative=false]:text-green-400 data-negative:text-red-400 dark:data-[negative=false]:text-green-300 dark:data-negative:text-red-300"
				>
					{value}
				</div>
				<span className="text-sm">{date.format("MMMM YYYY")}</span>
			</CardContent>
		</Card>
	)
}
