import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/utils/formatCurrency"
import { cva } from "class-variance-authority"
import dayjs from "dayjs"
import { ArrowDownCircleIcon, ArrowUpCircleIcon, Check } from "lucide-react"
import { useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { ColorCircle } from "../../components/ui/color-circle"
import { Skeleton } from "../../components/ui/skeleton"
import { useDelayedLoading } from "../../hooks/use-delayed-loading"
import { useFetchCategories } from "../../hooks/use-fetch-categories"
import { useFetchTransactions } from "../../hooks/use-fetch-transactions"
import { useUpdateTransaction } from "../../hooks/use-update-transaction"
import { TransactionType } from "../../transactions/constants/transaction-type"
import { Transaction } from "../../transactions/entities/transaction"

const transactionIconVariants = cva("w-4 h-4", {
	variants: {
		type: {
			[TransactionType.INCOME]: "text-green-600 dark:text-green-400",
			[TransactionType.EXPENSE]: "text-red-600 dark:text-red-400",
		},
	},
})

export const PendingTransactionsTable = () => {
	const { data: categories } = useFetchCategories()
	const endDate = useMemo(() => dayjs().endOf("month"), [])
	const { data: transactions, isLoading } = useFetchTransactions({ endDate })
	const { mutateAsync: updateTransaction } = useUpdateTransaction()
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
			if (!categories) return "amber"
			const category = categories.find((category) => category.id === categoryId)
			return category?.color ?? "amber"
		},
		[categories]
	)

	const handleMarkAsPaid = useCallback(
		async (transaction: Transaction) => {
			const updatedTransaction = new Transaction({
				...transaction,
				paymentDate: dayjs(),
			})
			await updateTransaction({ transaction: updatedTransaction, saveInInstallments: false })
		},
		[updateTransaction]
	)

	if (showDelayedSkeleton) return <Skeleton className="h-[400px] w-min-[500px] w-full" />

	if (!transactions || !categories) return null

	return (
		<Card className="h-[400px] w-min-[500px] w-full flex flex-col shadow-sm">
			<CardHeader>
				<CardTitle>Transações Pendentes</CardTitle>
				<CardDescription>Lista de transações que vencem este mês e ainda não foram pagas.</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 overflow-auto p-0">
				{transactions.length === 0 && (
					<div className="flex h-full items-center justify-center text-muted-foreground text-sm">
						Nenhuma transação pendente
					</div>
				)}
				{transactions.length > 0 && (
					<Table>
						<TableHeader className="sticky top-0 bg-background">
							<TableRow className="hover:bg-background">
								<TableHead>Situação</TableHead>
								<TableHead>Descrição</TableHead>
								<TableHead>Categoria</TableHead>
								<TableHead>Tipo</TableHead>
								<TableHead>Valor</TableHead>
								<TableHead>Ações</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{transactions
								.filter((t) => !t.paymentDate)
								.sort((a, b) => a.dueDate.diff(b.dueDate))
								.map((transaction) => {
									const isExpired = transaction.dueDate.isBefore(dayjs(), "day")
									const isToday = transaction.dueDate.isSame(dayjs(), "day")

									let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "secondary"
									let statusText = `Vence ${transaction.dueDate.fromNow()}`

									if (isExpired) {
										badgeVariant = "destructive"
										statusText = "Vencida"
									} else if (isToday) {
										badgeVariant = "default"
										statusText = "Vence hoje"
									}

									return (
										<TableRow key={transaction.id}>
											<TableCell>
												<Badge variant={badgeVariant}>{statusText}</Badge>
											</TableCell>
											<TableCell className="max-w-[200px] truncate whitespace-pre-wrap">
												{transaction.description}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<ColorCircle
														className="w-2 h-2"
														color={getCategoryColor(transaction.categoryId)}
													/>
													<span className="text-muted-foreground text-sm">
														{getCategoryName(transaction.categoryId)}
													</span>
												</div>
											</TableCell>
											<TableCell className="text-center">
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
											<TableCell className="font-bold">
												{formatCurrency(transaction.amount)}
											</TableCell>
											<TableCell>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-muted-foreground hover:text-primary"
													onClick={() => handleMarkAsPaid(transaction)}
													title="Marcar como pago"
												>
													<Check className="w-4 h-4" />
												</Button>
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
