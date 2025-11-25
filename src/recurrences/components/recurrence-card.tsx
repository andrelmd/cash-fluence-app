import { Edit, RefreshCcw, Trash } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { ColorCircle } from "../../components/ui/color-circle"
import { Label } from "../../components/ui/label"
import { useDeleteRecurrence } from "../../hooks/use-delete-recurrence"
import { useFetchOneCategory } from "../../hooks/use-fetch-one-category"
import { TransactionType } from "../../transactions/constants/transaction-type"
import { Recurrence } from "../entities/recurrence"

interface IRecurrenceCardProps {
	recurrence: Recurrence
	onEdit?: (recurrence: Recurrence) => void
}

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
						<div
							data-type={type}
							className="rounded-full text-white data-[type=0]:bg-green data-[type=1]:bg-red p-1.5 dark:text-black"
						>
							<RefreshCcw />
						</div>
						<div className="flex flex-col gap-2">
							{description}
							<Label>{dueDate.format("DD/MM/YYYY")}</Label>
						</div>
					</div>
				</CardTitle>
				<CardAction>
					<Button variant="ghost" onClick={handleOnEdit}>
						<Edit />
					</Button>
					<Button variant="ghost" onClick={handleOnDelete} className="text-red-400 dark:text-red-300">
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
					<div
						data-type={type}
						className="flex items-center gap-2 data-[type=0]:text-green-400 data-[type=1]:text-red-400 dark:data-[type=0]:text-green-300 dark:data-[type=1]:text-red-300"
					>
						{type === TransactionType.EXPENSE ? "-" : "+"}
						{amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
