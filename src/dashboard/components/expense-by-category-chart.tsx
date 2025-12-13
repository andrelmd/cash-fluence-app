import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"
import { Dayjs } from "dayjs"
import { RadialBar, RadialBarChart } from "recharts"
import { Skeleton } from "../../components/ui/skeleton"
import { categoryToKebabCase } from "../../helpers/category-to-kebab-case"
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
		acc[categoryToKebabCase(curr.category)] = {
			label: curr.category,
			color: curr.color,
		}
		return acc
	}, {} as ChartConfig) satisfies ChartConfig

	const chartData = data.map((item) => ({
		category: categoryToKebabCase(item.category),
		amount: item.amount,
		fill: categoryToKebabCase(`var(--color-${item.category})`),
	}))

	const showDelayedSkeleton = useDelayedLoading(isLoading, 500)

	if (showDelayedSkeleton) {
		return <Skeleton className="h-[589px] w-full" />
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Despesas por categoria</CardTitle>
				<CardDescription>{date.format("MMMM YYYY")}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px]">
					<RadialBarChart startAngle={-90} endAngle={380} data={chartData} innerRadius={30} outerRadius={110}>
						<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="category" />} />
						<RadialBar data={chartData} dataKey={"amount"} background />
						<ChartLegend content={<ChartLegendContent nameKey="category" />} />
					</RadialBarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
