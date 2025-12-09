import { Edit, Trash } from "lucide-react"
import { useMemo } from "react"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { ColorCircle } from "../../components/ui/color-circle"
import { useDeleteCategory } from "../../hooks/use-delete-category"
import { Category } from "../entities/Category"

interface ICategoryCardProps {
	category: Category
	onEdit?: (category: Category) => void
}

export const CategoryCard = ({ category, onEdit }: ICategoryCardProps) => {
	const { color, name, monthlyLimit } = category
	const { mutateAsync: deleteFn } = useDeleteCategory()
	const monthlyLimitContent = useMemo(() => {
		if (!monthlyLimit || monthlyLimit <= 0) return <Badge>Sem limite definido</Badge>
		return (
			<Badge className="rounded-sm">
				{monthlyLimit.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
			</Badge>
		)
	}, [monthlyLimit])

	const handleOnEdit = () => {
		onEdit?.(category)
	}

	const handleOnDelete = async () => {
		await deleteFn(category)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<ColorCircle color={color} />
					{name}
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
					<p>Limite mensal</p>
					{monthlyLimitContent}
				</div>
			</CardContent>
		</Card>
	)
}
