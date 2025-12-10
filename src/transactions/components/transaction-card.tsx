import { formatCurrency } from "@/utils/formatCurrency"
import { cva } from "class-variance-authority"
import { ArrowDownCircleIcon, ArrowUpCircleIcon, Edit, Trash } from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { ColorCircle } from "../../components/ui/color-circle"
import { Label } from "../../components/ui/label"
import { useDeleteTransaction } from "../../hooks/use-delete-transaction"
import { useFetchOneCategory } from "../../hooks/use-fetch-one-category"
import { TransactionType } from "../constants/transaction-type"
import { Transaction } from "../entities/transaction"

interface ITransactionCardProps {
	transaction: Transaction
	onEdit?: (transaction: Transaction) => void
}

const iconContainerVariants = cva("rounded-full text-white p-1.5 dark:text-black", {
	variants: {
		type: {
			[TransactionType.INCOME]: "bg-green-500 dark:bg-green-300",
			[TransactionType.EXPENSE]: "bg-red-500 dark:bg-red-300",
		},
	},
})

const amountVariants = cva("flex items-center gap-2", {
	variants: {
		type: {
			[TransactionType.INCOME]: "text-green-500 dark:text-green-300",
			[TransactionType.EXPENSE]: "text-red-500 dark:text-red-300",
		},
	},
})

export const TransactionCard = ({ transaction, onEdit }: ITransactionCardProps) => {
	const { amount, categoryId, dueDate, currentInstallment, description, installments, type, paymentDate } =
		transaction
	const transactionIcon = type === TransactionType.EXPENSE ? <ArrowDownCircleIcon /> : <ArrowUpCircleIcon />

	const { data: category } = useFetchOneCategory(categoryId)
	const { mutateAsync: deleteFn } = useDeleteTransaction()

	const handleOnDelete = async () => {
		if (!transaction.id) return
		await deleteFn(transaction)
	}

	const handleOnEdit = () => {
		if (onEdit) onEdit(transaction)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="flex gap-4 items-center">
						<div className={iconContainerVariants({ type })}>{transactionIcon}</div>
						<div className="flex flex-col gap-2">
							<div className="flex gap-2 items-center">
								{description}
								{installments && installments > 0 && (
									<Badge variant={"outline"}>
										{currentInstallment}/{installments}x
									</Badge>
								)}
							</div>
							<Label className="text-muted-foreground">{dueDate.format("DD/MM/YYYY")}</Label>
						</div>
					</div>
				</CardTitle>
				<CardAction>
					<Button variant="ghost" onClick={handleOnEdit}>
						<Edit />
					</Button>
					<Button variant="ghost" onClick={handleOnDelete} className="text-red-500 dark:text-red-300">
						<Trash />
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<div className="flex justify-between">
					<div className="flex flex-col gap-2">
						<div className="flex gap-2 items-center">
							{category && <ColorCircle className="w-4 h-4" color={category.color} />}
							<p>{category?.name}</p>
						</div>
						{paymentDate && (
							<div className="text-muted-foreground text-xs">
								Pago em {paymentDate.format("DD/MM/YYYY")}
							</div>
						)}
					</div>
					<div className={amountVariants({ type })}>
						{`${type === TransactionType.EXPENSE ? "-" : "+"}${formatCurrency(amount)}`}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
