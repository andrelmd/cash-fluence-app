import { motion } from "framer-motion"
import { Edit, Trash } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardHeader, CardTitle } from "../../components/ui/card"
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

	const handleOnEdit = (e: React.MouseEvent) => {
		e.stopPropagation()
		onEdit?.(plan)
	}

	const handleOnDelete = async (e: React.MouseEvent) => {
		e.stopPropagation()
		await deleteFn(plan)
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
						<div className="flex items-center gap-3">
							{category && <ColorCircle className="w-3 h-3" color={category.color} />}
							<CardTitle className="text-sm font-semibold">{category?.name}</CardTitle>
						</div>

						<div className="flex items-center gap-4">
							<div className="flex flex-col items-end">
								<span className="text-[10px] text-muted-foreground uppercase tracking-wider">
									Planejado
								</span>
								<span className="font-bold text-sm">
									{amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
								</span>
							</div>

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
