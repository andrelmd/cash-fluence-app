import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Dayjs } from "dayjs"
import { Pie, PieChart } from "recharts"
import { Skeleton } from "../../components/ui/skeleton"
import { IExpenseByCategoryChartData } from "../../helpers/expenses-by-category-calculation"
import { useDelayedLoading } from "../../hooks/use-delayed-loading"

export const description = "A donut chart with text"

interface IExpenseByCategoryChartProps {
	data: IExpenseByCategoryChartData[]
	date: Dayjs
	isLoading?: boolean
}

export const ExpenseByCategoryChart = ({ data, date, isLoading = false }: IExpenseByCategoryChartProps) => {
	const chartConfig = data.reduce((acc, curr) => {
		acc[curr.category] = {
			label: curr.category,
			color: curr.color,
		}
		return acc
	}, {} as ChartConfig)

	const chartData = data.map((item) => ({ ...item, fill: item.color }))

	const showDelayedSkeleton = useDelayedLoading(isLoading, 500)

	if (showDelayedSkeleton) {
		return <Skeleton className="h-[368px] w-full" />
	}

	return (
		<Card className="flex flex-col">
			<CardHeader className="items-center">
				<CardTitle>Despesas por categoria</CardTitle>
				<CardDescription>{date.format("MMMM YYYY")}</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
					<PieChart>
						<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="category" />} />
						<Pie data={chartData} dataKey={"amount"} nameKey={"category"} />
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
