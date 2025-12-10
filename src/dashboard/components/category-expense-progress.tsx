import { formatCurrency } from "@/utils/formatCurrency"
import React from "react"
import { ColorCircle } from "../../components/ui/color-circle"
import { Progress } from "../../components/ui/progress"
import { TColor } from "../../types/color"

interface ICategoryExpenseProgressProps extends React.ComponentPropsWithoutRef<"div"> {
	category: string
	percentage: number
	color: string
	actual: number
	planned: number
}

export const CategoryExpenseProgress = ({
	category,
	percentage,
	actual,
	color,
	planned,
}: ICategoryExpenseProgressProps) => {
	const currencyProgress = Number.isFinite(percentage) ? `${percentage.toFixed(2)}% utilizado` : "Sem limite"
	const actualVsPlanned = planned ? `${formatCurrency(actual)} / ${formatCurrency(planned)}` : formatCurrency(actual)

	return (
		<div className="flex flex-col gap-2">
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-2 text-md">
					<ColorCircle color={color as TColor} className="w-4 h-4" />
					{category}
				</div>
				<div className="text-muted-foreground font-medium text-sm">{actualVsPlanned}</div>
			</div>
			<Progress value={Number.isFinite(percentage) ? percentage : 100} />
			<div className="text-xs text-muted-foreground font-medium">{currencyProgress}</div>
		</div>
	)
}
