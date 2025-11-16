import { Dayjs } from "dayjs"
import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { IPlannedVsActualData } from "../../helpers/planned-vs-actual-calculation"
import { CategoryExpenseProgress } from "./category-expense-progress"

interface ICategoryExpenseCardProps {
	data: IPlannedVsActualData[]
	date: Dayjs
}

export const CategoryExpenseCard = ({ data, date }: ICategoryExpenseCardProps) => {
	const filteredData = useMemo(
		() => data.filter((item) => Number.isFinite(item.percentage) && item.percentage >= 0),
		[data]
	)

	return (
		<Card>
			<CardHeader>
				<CardTitle>Limites de consumo</CardTitle>
				<CardDescription>{date.format("MMMM YYYY")}</CardDescription>
			</CardHeader>
			<CardContent className="overflow-auto">
				{filteredData.map((item, index) => (
					<CategoryExpenseProgress key={index} {...item} />
				))}
			</CardContent>
		</Card>
	)
}
