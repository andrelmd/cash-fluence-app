import { Dayjs } from "dayjs"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../../components/ui/chart"
import { IChartData } from "../../helpers/balance-chart-calculation"

const chartConfig = {
	balance: {
		label: "balance",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig

interface IBalanceChartProps {
	data: IChartData[]
	date: Dayjs
}

export const BalanceChart = ({ data, date }: IBalanceChartProps) => {
	const maxBalance = Math.max(...data.map((item) => item.balance))
	const minBalance = Math.min(...data.map((item) => item.balance))

	return (
		<Card>
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
						<CartesianGrid vertical={false} />
						<YAxis domain={[minBalance - 5, maxBalance + 5]} tick={false} axisLine={false} />
						<XAxis dataKey={"date"} tickLine={false} axisLine={false} tickMargin={8} />
						<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
						<Line
							dataKey={"balance"}
							type={"natural"}
							stroke={"var(--color-balance)"}
							strokeWidth={2}
							dot={false}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
