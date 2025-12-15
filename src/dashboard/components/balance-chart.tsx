import { Dayjs } from "dayjs"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "../../components/ui/chart"
import { Skeleton } from "../../components/ui/skeleton"
import { IChartData } from "../../helpers/balance-chart-calculation"
import { useDelayedLoading } from "../../hooks/use-delayed-loading"

const chartConfig = {
	realizedBalance: {
		label: "Realizado",
		color: "var(--foreground)",
	},
	projectedBalance: {
		label: "Projetado",
		color: "var(--muted-foreground)",
	},
} satisfies ChartConfig

interface IBalanceChartProps {
	data: IChartData[]
	date: Dayjs
	isLoading?: boolean
}

export const BalanceChart = ({ data, date, isLoading = false }: IBalanceChartProps) => {
	const showDelayedSkeleton = useDelayedLoading(isLoading, 500)

	if (showDelayedSkeleton) {
		return <Skeleton className="flex-1 h-[368px] w-full" />
	}

	return (
		<Card className="flex-1">
			<CardHeader>
				<CardTitle>Balanço do mês</CardTitle>
				<CardDescription>{date.format("MMMM YYYY")}</CardDescription>
			</CardHeader>
			<CardContent className="p-8">
				<ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
					<AreaChart data={data}>
						<defs>
							<linearGradient id={"fillRealizedBalance"} x1="0" y1="0" x2="0" y2="1">
								<stop offset={"50%"} stopColor="var(--color-realizedBalance)" stopOpacity={0.8} />
								<stop offset={"95%"} stopColor="var(--color-realizedBalance)" stopOpacity={0.1} />
							</linearGradient>
							<linearGradient id="fillProjectedBalance" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="var(--color-projectedBalance)" stopOpacity={0.8} />
								<stop offset="95%" stopColor="var(--color-projectedBalance)" stopOpacity={0.1} />
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} />
						<XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									labelFormatter={(value) => {
										return value
									}}
									indicator="dot"
								/>
							}
						/>
						<Area
							dataKey="projectedBalance"
							type="natural"
							fill="url(#fillProjectedBalance)"
							stroke="var(--color-projectedBalance)"
							stackId="a"
						/>
						<Area
							dataKey="realizedBalance"
							type="natural"
							fill="url(#fillRealizedBalance)"
							stroke="var(--color-realizedBalance)"
							stackId="a"
						/>
						<ChartLegend content={<ChartLegendContent />} />
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
