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
import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import { IExpenseByCategoryChartData } from "../../helpers/expenses-by-category-calculation"

export const description = "A donut chart with text"

interface IExpenseByCategoryChartProps {
	data: IExpenseByCategoryChartData[]
	date: Dayjs
}

export const ExpenseByCategoryChart = ({ data, date }: IExpenseByCategoryChartProps) => {
	const chartConfig = data.reduce((acc, curr) => {
		acc[curr.category] = {
			label: curr.category,
			color: curr.color,
		}
		return acc
	}, {} as ChartConfig)

	const chartData = data.map((item) => ({ ...item, fill: item.color }))

	const totalExpenses = React.useMemo(() => {
		return data.reduce((acc, curr) => acc + curr.amount, 0)
	}, [data])

	return (
		<Card className="flex flex-col">
			<CardHeader className="items-center">
				<CardTitle>Gastos por categoria</CardTitle>
				<CardDescription>{date.format("MMMM YYYY")}</CardDescription>
			</CardHeader>
			<CardContent className="flex-1">
				<ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
					<PieChart accessibilityLayer>
						<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
						<Pie data={chartData} dataKey="amount" nameKey="category" innerRadius={70} strokeWidth={5}>
							<Label
								content={({ viewBox }) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-foreground text-xl font-bold"
												>
													{totalExpenses.toLocaleString("pt-BR", {
														style: "currency",
														currency: "BRL",
													})}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className="fill-muted-foreground"
												>
													Gastos
												</tspan>
											</text>
										)
									}
								}}
							/>
						</Pie>
						<ChartLegend
							content={<ChartLegendContent nameKey="category" />}
							className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
