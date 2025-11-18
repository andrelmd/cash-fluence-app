import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Dayjs } from "dayjs"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { IPlannedVsActualData } from "../../helpers/planned-vs-actual-calculation"

export function PlannedVsActualChart({ data, date }: { data: IPlannedVsActualData[]; date: Dayjs }) {
	const chartConfig = {
		planned: {
			label: "Planejado",
			color: "var(--chart-1)",
		},
		actual: {
			label: "Realizado",
			color: "var(--chart-2)",
		},
		paid: {
			label: "Pago",
			color: "var(--chart-3)",
		},
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Gasto real vs planejado</CardTitle>
				<CardDescription>{date.format("MMMM YYYY")}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
					<BarChart accessibilityLayer data={data}>
						<CartesianGrid vertical={false} />
						<XAxis dataKey="category" tickLine={false} tickMargin={10} axisLine={false} />
						<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
						<Bar dataKey="planned" fill="var(--color-planned)" radius={8} />
						<Bar dataKey="actual" fill="var(--color-actual)" radius={8} />
						<Bar dataKey="paid" fill="var(--color-paid)" radius={8} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
