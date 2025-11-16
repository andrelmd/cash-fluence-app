import { Dayjs } from "dayjs"
import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "../../components/ui/chart"
import { IBalanceByCategoryChartData } from "../../helpers/balance-by-category-calculation"

interface IBalanceByCategoryChartProps {
	data: IBalanceByCategoryChartData[]
	date: Dayjs
}

export const BalanceByCategoryChart = ({ data, date }: IBalanceByCategoryChartProps) => {
	const categories = useMemo(() => (data && data.length > 0 ? Object.keys(data[0].data) : []), [data])
	const colors = useMemo(() => (data && data.length > 0 ? data[0].colors : {}), [data])

	const chartConfig = categories.reduce((acc, curr) => {
		acc[curr] = {
			label: curr,
			color: colors[curr],
		}
		return acc
	}, {} as ChartConfig) satisfies ChartConfig

	const chartData = data.map((item) => ({ type: item.label, ...item.data }))

	return (
		<Card>
			<CardHeader>
				<CardTitle>Planejamento, gastos reais e limites mensais</CardTitle>
				<CardDescription>{date.format("MMMM YYYY")}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
					<BarChart accessibilityLayer data={chartData}>
						<CartesianGrid vertical={false} />
						<XAxis dataKey="type" tickLine={false} tickMargin={10} axisLine={false} />
						<ChartTooltip content={<ChartTooltipContent hideLabel />} />
						<ChartLegend content={<ChartLegendContent />} />
						{categories.map((category) => (
							<Bar
								key={category}
								dataKey={category}
								stackId="a"
								fill={`var(--color-${category})`}
								radius={[0, 0, 4, 4]}
							/>
						))}
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
