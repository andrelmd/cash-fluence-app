import { Dayjs } from "dayjs"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "../../components/ui/chart"
import { IBalanceByCategoryChartData } from "../../helpers/balance-by-category-calculation"

const chartConfig = {
	planned: {
		label: "Planejado",
		color: "var(--chart-1)",
	},
	actual: {
		label: "Real",
		color: "var(--chart-2)",
	},
	limit: {
		label: "Limite",
		color: "var(--chart-3)",
	},
}

interface IBalanceByCategoryChartProps {
	data: IBalanceByCategoryChartData[]
	date: Dayjs
}

export const BalanceByCategoryChart = ({ data, date }: IBalanceByCategoryChartProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Planejamento, gastos reais e limites mensais</CardTitle>
				<CardDescription>{date.format("MMMM YYYY")}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
					<BarChart accessibilityLayer data={data}>
						<CartesianGrid vertical={false} />
						<XAxis dataKey="category" tickLine={false} tickMargin={10} axisLine={false} />
						<ChartTooltip content={<ChartTooltipContent hideLabel />} />
						<ChartLegend content={<ChartLegendContent />} />
						<Bar dataKey="planned" stackId="a" fill="var(--color-planned)" radius={[0, 0, 4, 4]} />
						<Bar dataKey="actual" stackId="a" fill="var(--color-actual)" radius={[4, 4, 0, 0]} />
						<Bar dataKey="limit" stackId="a" fill="var(--color-limit)" radius={[0, 0, 4, 4]} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
