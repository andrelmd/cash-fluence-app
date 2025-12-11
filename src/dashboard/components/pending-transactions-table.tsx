import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/utils/formatCurrency"
import { cva, VariantProps } from "class-variance-authority"
import dayjs from "dayjs"
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from "lucide-react"
import { useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { ColorCircle } from "../../components/ui/color-circle"
import { Skeleton } from "../../components/ui/skeleton"
import { useDelayedLoading } from "../../hooks/use-delayed-loading"
import { useFetchCategories } from "../../hooks/use-fetch-categories"
import { useFetchTransactions } from "../../hooks/use-fetch-transactions"
import { TransactionType } from "../../transactions/constants/transaction-type"

const situationCellVariants = cva("max-w-[200px] truncate whitespace-pre-wrap", {
	variants: {
		status: {
			expired: "text-red-500 dark:text-red-300",
			expiresIn7d: "text-amber-500 dark:text-amber-300",
			expiresIn15d: "text-green-500 dark:text-green-300",
			default: "text-muted-foreground",
		},
	},
	defaultVariants: {
		status: "default",
	},
})

const transactionIconVariants = cva("", {
	variants: {
		type: {
			[TransactionType.INCOME]: "text-green-500 dark:text-green-300",
			[TransactionType.EXPENSE]: "text-red-500 dark:text-red-300",
		},
	},
})

export const PendingTransactionsTable = () => {
	const { data: categories } = useFetchCategories()
	const endDate = useMemo(() => dayjs().endOf("month"), [])
	const { data: transactions, isLoading } = useFetchTransactions({ endDate })
	const showDelayedSkeleton = useDelayedLoading(isLoading, 500)

	const getCategoryName = useCallback(
		(categoryId: number) => {
			if (!categories) return ""
			const category = categories.find((category) => category.id === categoryId)
			return category?.name ?? ""
		},
		[categories]
	)

	const getCategoryColor = useCallback(
		(categoryId: number) => {
			if (!categories) return "primary"
			const category = categories.find((category) => category.id === categoryId)
			return category?.color ?? "primary"
		},
		[categories]
	)

	if (showDelayedSkeleton) return <Skeleton className="h-[368px] w-min-[500px] w-full" />

	if (!transactions || !categories) return null

	return (
		<Card className="h-[368px] w-min-[500px] w-full">
			<CardHeader>
				<CardTitle>Transações Pendentes</CardTitle>
				<CardDescription>Lista de transações que ainda não foram pagas.</CardDescription>
			</CardHeader>
			<CardContent className="relative h-[250px] w-min-[450px] overflow-y-auto">
				{transactions.length === 0 && (
					<div className="flex flex-1 items-center justify-center">Nenhuma transação pendente</div>
				)}
				{transactions.length > 0 && (
					<Table>
						<TableHeader className="sticky -top-px bg-background w-min-[450px]">
							<TableRow className="hover:bg-background">
								<TableHead className="rounded-tl-xl w-[200px]">Situação</TableHead>
								<TableHead className="w-[200px]">Descrição</TableHead>
								<TableHead className="w-[200px]">Categoria</TableHead>
								<TableHead>Tipo</TableHead>
								<TableHead className="text-right rounded-tr-xl">Valor</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{transactions
								.filter((t) => !t.paymentDate)
								.sort((a, b) => a.dueDate.diff(b.dueDate))
								.map((transaction) => {
									const isExpired = transaction.dueDate.isBefore()
									const daysToExpire = transaction.dueDate.endOf("day").diff(dayjs(), "day")

									const getStatus = (): VariantProps<typeof situationCellVariants>["status"] => {
										if (isExpired) return "expired"
										if (daysToExpire <= 7) return "expiresIn7d"
										if (daysToExpire <= 15) return "expiresIn15d"
										return "default"
									}

									return (
										<TableRow key={transaction.id}>
											<TableCell className={situationCellVariants({ status: getStatus() })}>
												{isExpired
													? `Vencida ${transaction.dueDate.fromNow()}`
													: `Vence ${transaction.dueDate.fromNow()}`}
											</TableCell>
											<TableCell className="max-w-[200px] truncate whitespace-pre-wrap">
												{transaction.description}
											</TableCell>
											<TableCell className="max-w-[200px] truncate whitespace-pre-wrap">
												<div className="flex items-center gap-2">
													<ColorCircle
														className="w-3 h-3"
														color={getCategoryColor(transaction.categoryId)}
													/>
													{getCategoryName(transaction.categoryId)}
												</div>
											</TableCell>
											<TableCell>
												{transaction.type === TransactionType.EXPENSE ? (
													<ArrowDownCircleIcon
														className={transactionIconVariants({
															type: TransactionType.EXPENSE,
														})}
													/>
												) : (
													<ArrowUpCircleIcon
														className={transactionIconVariants({
															type: TransactionType.INCOME,
														})}
													/>
												)}
											</TableCell>
											<TableCell className="text-right">
												{formatCurrency(transaction.amount)}
											</TableCell>
										</TableRow>
									)
								})}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	)
}
