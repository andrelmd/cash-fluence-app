import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Dayjs } from "dayjs"
import { RadialBar, RadialBarChart } from "recharts"
import { IPaidByCategoryChartData } from "../../helpers/paid-by-category-calculation"

interface IPaidByCategoryChartProps {
	data: IPaidByCategoryChartData[]
	date: Dayjs
}

export const PaidByCategoryChart = ({ data, date }: IPaidByCategoryChartProps) => {
	const chartConfig = data.reduce((acc, curr) => {
		acc[curr.category] = {
			label: curr.category,
			color: curr.color,
		}
		return acc
	}, {} as ChartConfig)

	const chartData = data.map((item) => ({ ...item, fill: item.color }))

	return (
		<Card className="flex flex-col">
			<CardHeader className="items-center">
				<CardTitle>Pagamentos por categoria</CardTitle>
				<CardDescription>{date.format("MMMM YYYY")}</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
					<RadialBarChart data={chartData} innerRadius={30} outerRadius={110}>
						<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="category" />} />
						<RadialBar dataKey="amount" background />
					</RadialBarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
