import { formatCurrency } from "@/utils/formatCurrency"
import { cva } from "class-variance-authority"
import { Dayjs } from "dayjs"
import { TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Skeleton } from "../../components/ui/skeleton"
import { calculateBalanceCardValues } from "../../helpers/balance-card-calculations"
import { useDelayedLoading } from "../../hooks/use-delayed-loading"
import { TransactionType } from "../../transactions/constants/transaction-type"
import { Transaction } from "../../transactions/entities/transaction"

interface ITransactionSummaryCardProps {
	type?: TransactionType | null
	date: Dayjs
	transactions?: Transaction[]
}

const iconContainerVariants = cva("rounded-full p-2", {
	variants: {
		type: {
			income: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
			expense: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
			balance: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
		},
	},
})

const valueVariants = cva("text-2xl font-bold", {
	variants: {
		type: {
			income: "text-green-600 dark:text-green-400",
			expense: "text-red-600 dark:text-red-400",
			balance: "text-blue-600 dark:text-blue-400",
		},
		isNegative: {
			true: "",
			false: "",
		},
	},
	compoundVariants: [
		{
			type: "balance",
			isNegative: true,
			className: "text-red-600 dark:text-red-400",
		},
	],
})

export const BalanceCard = ({
	type = null,
	date,
	transactions,
	isLoading = false,
}: ITransactionSummaryCardProps & { isLoading?: boolean }) => {
	const showDelayedSkeleton = useDelayedLoading(isLoading, 500)

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
				return <TrendingUp className="h-4 w-4" />
			case TransactionType.EXPENSE:
				return <TrendingDown className="h-4 w-4" />
			default:
				return <Wallet className="h-4 w-4" />
		}
	}, [type])

	const { realizedValue, projectedValue } = useMemo(
		() => calculateBalanceCardValues(transactions, type),
		[transactions, type]
	)

	const iconVariant =
		type === TransactionType.INCOME ? "income" : type === TransactionType.EXPENSE ? "expense" : "balance"

	if (showDelayedSkeleton) {
		return <Skeleton className="flex-1 h-[140px]" />
	}

	return (
		<Card className="flex-1 shadow-sm">
			<CardHeader>
				<div className="flex flex-col pb-2">
					<div className="flex flex-row items-center justify-between">
						<CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
						<div className={iconContainerVariants({ type: iconVariant })}>{icon}</div>
					</div>
					<div className="text-xs text-muted-foreground mt-1">{date.format("MMMM YYYY")}</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className={valueVariants({ type: iconVariant, isNegative: realizedValue < 0 })}>
					{formatCurrency(realizedValue)}
				</div>
				<p className="text-xs text-muted-foreground mt-1">Projetado: {formatCurrency(projectedValue)}</p>
			</CardContent>
		</Card>
	)
}
