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
import { IPaidByCategoryChartData } from "../../helpers/paid-by-category-calculation"
import { useDelayedLoading } from "../../hooks/use-delayed-loading"

interface IPaidByCategoryChartProps {
	data: IPaidByCategoryChartData[]
	date: Dayjs
	isLoading?: boolean
}

export const PaidByCategoryChart = ({ data, date, isLoading = false }: IPaidByCategoryChartProps) => {
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
		<Card className="flex flex-col">
			<CardHeader className="items-center">
				<CardTitle>Pagamentos por categoria</CardTitle>
				<CardDescription>{date.format("MMMM YYYY")}</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px]">
					<RadialBarChart startAngle={-90} endAngle={380} data={chartData} innerRadius={30} outerRadius={110}>
						<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="category" />} />
						<RadialBar dataKey="amount" background />
						<ChartLegend
							content={<ChartLegendContent nameKey="category" />}
							className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
						/>
					</RadialBarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
