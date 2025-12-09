import { cva, VariantProps } from "class-variance-authority"
import { Dayjs } from "dayjs"
import { TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Skeleton } from "../../components/ui/skeleton"
import { calculateBalanceCardValues, formatCurrency } from "../../helpers/balance-card-calculations"
import { useDelayedLoading } from "../../hooks/use-delayed-loading"
import { TransactionType } from "../../transactions/constants/transaction-type"
import { Transaction } from "../../transactions/entities/transaction"

interface ITransactionSummaryCardProps {
	type?: TransactionType | null
	date: Dayjs
	transactions?: Transaction[]
}

const balanceCardVariants = cva("", {
	variants: {
		type: {
			income: "text-green-500 dark:text-green-300",
			expense: "text-red-500 dark:text-red-300",
			balance: "text-blue-400 dark:text-blue-300",
		},
		isNegative: {
			true: "text-red-500 dark:text-red-300",
			false: "text-green-500 dark:text-green-300",
		},
	},
	compoundVariants: [
		{
			type: "balance",
			isNegative: undefined,
			className: "text-blue-400 dark:text-blue-300",
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
				return <TrendingUp />
			case TransactionType.EXPENSE:
				return <TrendingDown />
			default:
				return <Wallet />
		}
	}, [type])

	const { realizedValue, projectedValue } = useMemo(
		() => calculateBalanceCardValues(transactions, type),
		[transactions, type]
	)

	const isRealizedValueNegative = useMemo(() => {
		return realizedValue < 0
	}, [realizedValue])

	const variantProps: VariantProps<typeof balanceCardVariants> = useMemo(() => {
		switch (type) {
			case TransactionType.INCOME:
				return { type: "income" }
			case TransactionType.EXPENSE:
				return { type: "expense" }
			default:
				return { type: "balance", isNegative: isRealizedValueNegative }
		}
	}, [type, isRealizedValueNegative])

	if (showDelayedSkeleton) {
		return <Skeleton className="flex-1 h-[170px]" />
	}

	return (
		<Card className="flex-1">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>{title}</CardTitle>
					<div className={balanceCardVariants(variantProps)}>{icon}</div>
				</div>
				<CardDescription>{date.format("MMMM YYYY")}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col">
					<span className={`font-bold text-lg ${balanceCardVariants(variantProps)}`}>
						{formatCurrency(realizedValue)}
					</span>
					<span className="text-xs text-muted-foreground">Projetado: {formatCurrency(projectedValue)}</span>
				</div>
			</CardContent>
		</Card>
	)
}
