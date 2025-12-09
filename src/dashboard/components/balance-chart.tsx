import { Dayjs } from "dayjs"
import { useMemo } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../../components/ui/chart"
import { Skeleton } from "../../components/ui/skeleton"
import { IChartData } from "../../helpers/balance-chart-calculation"
import { useDelayedLoading } from "../../hooks/use-delayed-loading"

const chartConfig = {
	realizedBalance: {
		label: "Realizado",
		color: "var(--chart-1)",
	},
	projectedBalance: {
		label: "Projetado",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig

interface IBalanceChartProps {
	data: IChartData[]
	date: Dayjs
	isLoading?: boolean
}

export const BalanceChart = ({ data, date, isLoading = false }: IBalanceChartProps) => {
	const showDelayedSkeleton = useDelayedLoading(isLoading, 500)
	const allValues = useMemo(() => data.flatMap((item) => [item.realizedBalance, item.projectedBalance]), [data])

	if (showDelayedSkeleton) {
		return <Skeleton className="flex-1 h-[368px] w-full" />
	}

	const maxBalance = allValues.length > 0 ? Math.max(...allValues) : 0
	const minBalance = allValues.length > 0 ? Math.min(...allValues) : 0

	return (
		<Card className="flex-1">
			<CardHeader>
				<CardTitle>Balanço do mês</CardTitle>
				<CardDescription>{date.format("MMMM YYYY")}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
					<LineChart
						accessibilityLayer
						data={data}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} horizontal={true} />
						<YAxis domain={[minBalance * -1.3, maxBalance * 1.3]} tick={false} axisLine={false} />
						<XAxis dataKey={"date"} tickLine={false} axisLine={false} tickMargin={8} />
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						<Line
							dataKey={"realizedBalance"}
							type={"natural"}
							stroke={"var(--color-realizedBalance)"}
							strokeWidth={2}
							dot={false}
						/>
						<Line
							dataKey={"projectedBalance"}
							type={"natural"}
							stroke={"var(--color-projectedBalance)"}
							strokeWidth={2}
							dot={false}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
