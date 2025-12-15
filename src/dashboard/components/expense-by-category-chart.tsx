import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Dayjs } from "dayjs"
import { useMemo } from "react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Skeleton } from "../../components/ui/skeleton"
import { IExpenseRealizedByCategoryChartData } from "../../helpers/expenses-by-category-calculation"
import { useDelayedLoading } from "../../hooks/use-delayed-loading"

interface IExpenseRealizedByCategoryChartProps {
	data: IExpenseRealizedByCategoryChartData[]
	date: Dayjs
	isLoading?: boolean
}

const chartConfig = {
	projected: {
		label: "Projetado",
		color: "var(--muted-foreground)",
	},
	realized: {
		label: "Realizado",
		color: "var(--foreground)",
	},
} satisfies ChartConfig

export const ExpenseByCategoryChart = ({ data, date, isLoading = false }: IExpenseRealizedByCategoryChartProps) => {
	const showDelayedSkeleton = useDelayedLoading(isLoading, 500)

	const allValues = useMemo(() => data.flatMap((item) => [item.realized, item.projected]), [data])
	const maxBalance = allValues.length > 0 ? Math.max(...allValues) : 0
	const minBalance = allValues.length > 0 ? Math.min(...allValues) : 0

	if (showDelayedSkeleton) {
		return <Skeleton className="h-[589px] w-full" />
	}

	if (data.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Despesas por Categoria</CardTitle>
					<CardDescription>{date.format("MMMM YYYY")}</CardDescription>
				</CardHeader>
				<CardContent className="h-[400px] flex items-center justify-center">
					<p className="text-muted-foreground">Nenhuma despesa para o período.</p>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Despesas por Categoria</CardTitle>
				<CardDescription>{date.format("MMMM YYYY")}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[400px] w-full">
					<BarChart accessibilityLayer data={data} layout="vertical">
						<XAxis type="number" dataKey={"realized"} hide domain={[minBalance * -1.1, maxBalance * 1.1]} />
						<XAxis
							type="number"
							dataKey={"projected"}
							hide
							domain={[minBalance * -1.1, maxBalance * 1.1]}
						/>
						<YAxis type="category" dataKey={"category"} tickLine={false} tickMargin={10} axisLine={false} />
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						<Bar dataKey="realized" fill="var(--color-realized)" radius={5} />
						<Bar dataKey="projected" fill="var(--color-projected)" radius={5} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
