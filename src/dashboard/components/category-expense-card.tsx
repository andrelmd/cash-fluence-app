import { Dayjs } from "dayjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Skeleton } from "../../components/ui/skeleton"
import { IPlannedVsActualData } from "../../helpers/planned-vs-actual-calculation"
import { useDelayedLoading } from "../../hooks/use-delayed-loading"
import { CategoryExpenseProgress } from "./category-expense-progress"

interface ICategoryExpenseCardProps {
	data: IPlannedVsActualData[]
	date: Dayjs
	isLoading?: boolean
}

export const CategoryExpenseCard = ({ data, date, isLoading = false }: ICategoryExpenseCardProps) => {
	const showDelayedSkeleton = useDelayedLoading(isLoading, 500)

	if (showDelayedSkeleton) {
		return <Skeleton className="h-[368px] w-full" />
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Limites de consumo</CardTitle>
				<CardDescription>{date.format("MMMM YYYY")}</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col h-[250px] overflow-auto gap-1">
				{data
					.sort((a, b) => a.category.localeCompare(b.category))
					.map((item, index) => (
						<CategoryExpenseProgress key={index} {...item} />
					))}
			</CardContent>
		</Card>
	)
}
