import { motion } from "framer-motion"
import { Edit, Trash } from "lucide-react"
import { useMemo } from "react"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardHeader, CardTitle } from "../../components/ui/card"
import { ColorCircle } from "../../components/ui/color-circle"
import { CategoryProgressChart } from "../../dashboard/components/category-progress-chart"
import { useDashboardData } from "../../hooks/use-dashboard-data"
import { useDeleteCategory } from "../../hooks/use-delete-category"
import { Category } from "../entities/Category"

interface ICategoryCardProps {
	category: Category
	onEdit?: (category: Category) => void
}

export const CategoryCard = ({ category, onEdit }: ICategoryCardProps) => {
	const { color, name, monthlyLimit } = category
	const { mutateAsync: deleteFn } = useDeleteCategory()

	const handleOnEdit = (e: React.MouseEvent) => {
		e.stopPropagation()
		onEdit?.(category)
	}

	const handleOnDelete = async (e: React.MouseEvent) => {
		e.stopPropagation()
		await deleteFn(category)
	}

	const { projectedVsRealizedData } = useDashboardData()

	const spentAmount = useMemo(() => {
		return projectedVsRealizedData.find((item) => item.category === category.name)?.projected || 0
	}, [projectedVsRealizedData, category.name])

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
							<ColorCircle className="w-3 h-3" color={color} />
							<CardTitle className="text-sm font-semibold">{name}</CardTitle>
						</div>

						<div className="flex items-center gap-2">
							{monthlyLimit && monthlyLimit > 0 ? (
								<div className="h-20 w-20">
									<CategoryProgressChart spent={spentAmount} limit={monthlyLimit} />
								</div>
							) : (
								<div className="flex flex-col items-end">
									<span className="text-[10px] text-muted-foreground uppercase tracking-wider">
										Limite Mensal
									</span>
									<Badge variant="secondary" className="text-[10px] h-5 font-normal">
										Sem limite
									</Badge>
								</div>
							)}
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
