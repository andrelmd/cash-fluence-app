import { formatCurrency } from "@/utils/formatCurrency"
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../../components/ui/chart"

interface ICategoryProgressChartProps {
	spent: number
	limit: number
}

export const CategoryProgressChart = ({ spent, limit }: ICategoryProgressChartProps) => {
	const percentage = limit > 0 ? spent / limit : 0
	const remaining = limit - spent
	const color = percentage > 1 ? "var(--destructive)" : "var(--color-green-500)"

	const chartConfig = {
		spent: {
			label: "Gasto",
			color,
		},
	} satisfies ChartConfig

	const chartData = [
		{
			value: Math.min(1, percentage),
			fill: "var(--color-spent)",
		},
	]

	return (
		<ChartContainer config={chartConfig} className="mx-auto aspect-square h-full w-full">
			<RadialBarChart
				startAngle={90}
				endAngle={-270}
				barSize={8}
				data={chartData}
				innerRadius="80%"
				outerRadius="100%"
			>
				<PolarAngleAxis type="number" domain={[0, 1]} tick={false} axisLine={false} />
				<ChartTooltip
					cursor={false}
					content={
						<ChartTooltipContent
							hideLabel
							formatter={() => (
								<div className="flex flex-col text-xs gap-0.5">
									<div className="font-bold">Resumo do Limite</div>
									<span>Gasto: {formatCurrency(spent)}</span>
									<span>Limite: {formatCurrency(limit)}</span>
									<span className={remaining < 0 ? "text-destructive font-semibold" : ""}>
										Restante: {formatCurrency(remaining)}
									</span>
								</div>
							)}
						/>
					}
				/>

				<RadialBar dataKey="value" background />
			</RadialBarChart>
		</ChartContainer>
	)
}
