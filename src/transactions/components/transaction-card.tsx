import { formatCurrency } from "@/utils/formatCurrency"
import { cva } from "class-variance-authority"
import { motion } from "framer-motion"
import { ArrowDownCircleIcon, ArrowUpCircleIcon, Edit, Trash } from "lucide-react"
import { useState } from "react"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardHeader, CardTitle } from "../../components/ui/card"
import { ColorCircle } from "../../components/ui/color-circle"
import { useDeleteTransaction } from "../../hooks/use-delete-transaction"
import { useFetchOneCategory } from "../../hooks/use-fetch-one-category"
import { TransactionType } from "../constants/transaction-type"
import { Transaction } from "../entities/transaction"
import { TrnasactionDeleteInstallmentsDialog } from "./transaction-delete-installments-dialog"

interface ITransactionCardProps {
	transaction: Transaction
	onEdit?: (transaction: Transaction) => void
}

const iconContainerVariants = cva("rounded-full p-2", {
	variants: {
		type: {
			[TransactionType.INCOME]: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
			[TransactionType.EXPENSE]: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
		},
	},
})

const amountVariants = cva("font-bold text-base", {
	variants: {
		type: {
			[TransactionType.INCOME]: "text-green-600 dark:text-green-400",
			[TransactionType.EXPENSE]: "text-red-600 dark:text-red-400",
		},
	},
})

export const TransactionCard = ({ transaction, onEdit }: ITransactionCardProps) => {
	const {
		amount,
		categoryId,
		dueDate,
		currentInstallment,
		description,
		installments,
		type,
		paymentDate,
		installmentCode,
	} = transaction
	const transactionIcon =
		type === TransactionType.EXPENSE ? (
			<ArrowDownCircleIcon className="w-5 h-5" />
		) : (
			<ArrowUpCircleIcon className="w-5 h-5" />
		)

	const { data: category } = useFetchOneCategory(categoryId)
	const { mutateAsync: deleteFn } = useDeleteTransaction()
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

	const handleOnDelete = async (e: React.MouseEvent) => {
		e.stopPropagation()
		if (!transaction.id) return

		if (installmentCode) return setOpenDeleteDialog(true)
		await deleteFn(transaction)
	}

	const handleOnEdit = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (onEdit) onEdit(transaction)
	}

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 20, scale: 0.98 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, height: 0, marginBottom: 0, padding: 0, transition: { duration: 0.2 } }}
		>
			<Card className="group hover:shadow-md transition-all duration-200">
				<CardHeader className="p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className={iconContainerVariants({ type })}>{transactionIcon}</div>
							<div className="flex flex-col gap-1">
								<div className="flex gap-2 items-center">
									<CardTitle className="text-sm font-semibold leading-none">{description}</CardTitle>
									{installments && installments > 0 && (
										<Badge variant="secondary" className="text-[10px] px-1.5 h-5 font-normal">
											{currentInstallment}/{installments}x
										</Badge>
									)}
								</div>
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									{category && (
										<div className="flex items-center gap-1.5">
											<ColorCircle className="w-2 h-2" color={category.color} />
											<span>{category.name}</span>
										</div>
									)}
									<span>•</span>
									{paymentDate ? (
										<>
											<span>{paymentDate.format("DD/MM/YYYY")}</span>
											<span>•</span>
											<span>Pago</span>
										</>
									) : (
										<span>{dueDate.format("DD/MM/YYYY")}</span>
									)}
								</div>
							</div>
						</div>

						<div className="flex items-center gap-4">
							<span className={amountVariants({ type })}>
								{type === TransactionType.EXPENSE ? "-" : "+"}
								{formatCurrency(amount)}
							</span>

							<div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
								<Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleOnEdit}>
									<Edit className="w-4 h-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-muted-foreground hover:text-destructive"
									onClick={handleOnDelete}
								>
									<Trash className="w-4 h-4" />
								</Button>
							</div>
						</div>
					</div>
				</CardHeader>
			</Card>
			<TrnasactionDeleteInstallmentsDialog
				transaction={transaction}
				open={openDeleteDialog}
				onOpenChange={setOpenDeleteDialog}
			/>
		</motion.div>
	)
}
