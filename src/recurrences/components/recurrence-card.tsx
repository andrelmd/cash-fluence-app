import { formatCurrency } from "@/utils/formatCurrency"
import { cva } from "class-variance-authority"
import { motion } from "framer-motion"
import { Edit, RefreshCcw, Trash } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardHeader, CardTitle } from "../../components/ui/card"
import { ColorCircle } from "../../components/ui/color-circle"
import { useDeleteRecurrence } from "../../hooks/use-delete-recurrence"
import { useFetchOneCategory } from "../../hooks/use-fetch-one-category"
import { TransactionType } from "../../transactions/constants/transaction-type"
import { Recurrence } from "../entities/recurrence"

interface IRecurrenceCardProps {
	recurrence: Recurrence
	onEdit?: (recurrence: Recurrence) => void
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

export const RecurrenceCard = ({ recurrence, onEdit }: IRecurrenceCardProps) => {
	const { amount, categoryId, dueDate, description, type } = recurrence

	const { data: category } = useFetchOneCategory(categoryId)
	const { mutateAsync: deleteFn } = useDeleteRecurrence()

	const handleOnDelete = async (e: React.MouseEvent) => {
		e.stopPropagation()
		if (!recurrence.id) return
		await deleteFn(recurrence)
	}

	const handleOnEdit = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (onEdit) onEdit(recurrence)
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
							<div className={iconContainerVariants({ type })}>
								<RefreshCcw className="w-5 h-5" />
							</div>
							<div className="flex flex-col gap-1">
								<CardTitle className="text-sm font-semibold leading-none">{description}</CardTitle>
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									{category && (
										<div className="flex items-center gap-1.5">
											<ColorCircle className="w-2 h-2" color={category.color} />
											<span>{category.name}</span>
										</div>
									)}
									<span>•</span>
									<span>Todo dia {dueDate.format("D")}</span>
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
		</motion.div>
	)
}
