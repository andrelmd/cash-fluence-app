import { cva } from "class-variance-authority"
import { Edit, RefreshCcw, Trash } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { ColorCircle } from "../../components/ui/color-circle"
import { Label } from "../../components/ui/label"
import { formatCurrency } from "../../helpers/balance-card-calculations"
import { useDeleteRecurrence } from "../../hooks/use-delete-recurrence"
import { useFetchOneCategory } from "../../hooks/use-fetch-one-category"
import { TransactionType } from "../../transactions/constants/transaction-type"
import { Recurrence } from "../entities/recurrence"

interface IRecurrenceCardProps {
	recurrence: Recurrence
	onEdit?: (recurrence: Recurrence) => void
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

export const RecurrenceCard = ({ recurrence, onEdit }: IRecurrenceCardProps) => {
	const { amount, categoryId, dueDate, description, type } = recurrence

	const { data: category } = useFetchOneCategory(categoryId)
	const { mutateAsync: deleteFn } = useDeleteRecurrence()

	const handleOnDelete = async () => {
		if (!recurrence.id) return
		await deleteFn(recurrence)
	}

	const handleOnEdit = () => {
		if (onEdit) onEdit(recurrence)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="flex gap-4 items-center">
						<div className={iconContainerVariants({ type })}>
							<RefreshCcw />
						</div>
						<div className="flex flex-col gap-2">
							{description}
							<Label className="text-muted-foreground text-xs">Todo dia {dueDate.format("D")}</Label>
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
					</div>
					<div className={amountVariants({ type })}>
						{`${type === TransactionType.EXPENSE ? "-" : "+"}${formatCurrency(amount)}`}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
