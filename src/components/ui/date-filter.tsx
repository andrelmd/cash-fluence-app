import dayjs from "dayjs"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo } from "react"
import { usePeriodFilterContext } from "../../contexts/period-filter-context"
import { useFetchFirstYearTransaction } from "../../hooks/use-fetch-first-year-transaction"
import { useFetchLastYearTransaction } from "../../hooks/use-fetch-last-year-transaction"
import { ISelectFieldOptions } from "../../interfaces/select-field-options"
import { Button } from "./button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

export const DateFilter = () => {
	const { month, setMonth, year, setYear, navigateToNextMonth, navigateToPreviousMonth } = usePeriodFilterContext()

	const { data: firstYear } = useFetchFirstYearTransaction()
	const { data: lastYear } = useFetchLastYearTransaction()

	const MonthOptions: ISelectFieldOptions[] = useMemo(
		() =>
			Array.from({ length: 12 }, (_, index) => ({
				label: dayjs().month(index).format("MMMM"),
				value: String(index),
			})),
		[]
	)

	const YearOptions: ISelectFieldOptions[] = useMemo(() => {
		const latestYear = lastYear || dayjs().year()

		if (!firstYear)
			return [
				{
					label: String(latestYear),
					value: String(latestYear),
				},
			]

		return Array.from({ length: latestYear - firstYear + 1 }, (_, index) => ({
			label: String(firstYear + index),
			value: String(firstYear + index),
		}))
	}, [firstYear, lastYear])

	return (
		<div className="flex items-center gap-2">
			<Button variant="ghost" size="icon-sm" onClick={navigateToPreviousMonth} aria-label="Mês anterior">
				<ChevronLeft className="size-4" />
			</Button>

			<div className="flex items-center gap-1">
				<Select value={String(month)} onValueChange={(value) => setMonth(Number(value))}>
					<SelectTrigger className="w-auto min-w-[120px] border-none shadow-none bg-transparent font-medium capitalize">
						<SelectValue placeholder="Mês" />
					</SelectTrigger>
					<SelectContent>
						{MonthOptions.map((option) => (
							<SelectItem key={option.value} value={option.value} className="capitalize">
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<span className="text-muted-foreground">/</span>

				<Select value={String(year)} onValueChange={(value) => setYear(Number(value))}>
					<SelectTrigger className="w-auto min-w-[80px] border-none shadow-none bg-transparent font-medium">
						<SelectValue placeholder="Ano" />
					</SelectTrigger>
					<SelectContent>
						{YearOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<Button variant="ghost" size="icon-sm" onClick={navigateToNextMonth} aria-label="Próximo mês">
				<ChevronRight className="size-4" />
			</Button>
		</div>
	)
}
