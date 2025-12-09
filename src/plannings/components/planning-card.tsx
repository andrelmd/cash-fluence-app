import { Edit, Trash } from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { ColorCircle } from "../../components/ui/color-circle"
import { useDeletePlanning } from "../../hooks/use-delete-planning"
import { useFetchOneCategory } from "../../hooks/use-fetch-one-category"
import { Planning } from "../entities/planning"

interface IPlanningCardProps {
	plan: Planning
	onEdit?: (plan: Planning) => void
}

export const PlanningCard = ({ plan: plan, onEdit }: IPlanningCardProps) => {
	const { amount, categoryId } = plan

	const { data: category } = useFetchOneCategory(categoryId)
	const { mutateAsync: deleteFn } = useDeletePlanning()

	const handleOnEdit = () => {
		onEdit?.(plan)
	}

	const handleOnDelete = async () => {
		await deleteFn(plan)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					{category && <ColorCircle color={category.color} />}
					{category && <>{category.name}</>}
				</CardTitle>
				<CardAction>
					<Button variant="ghost" onClick={handleOnEdit}>
						<Edit />
					</Button>
					<Button className="text-red-500 dark:text-red-300" variant="ghost" onClick={handleOnDelete}>
						<Trash />
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<div>
					<p>Valor planejado</p>
					<Badge className="rounded-sm">
						{amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
					</Badge>
				</div>
			</CardContent>
		</Card>
	)
}
