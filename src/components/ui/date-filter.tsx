import dayjs from "dayjs"
import { useMemo } from "react"
import { usePeriodFilterContext } from "../../contexts/period-filter-context"
import { useFetchFirstYearTransaction } from "../../hooks/use-fetch-first-year-transaction"
import { useFetchLastYearTransaction } from "../../hooks/use-fetch-last-year-transaction"
import { ISelectFieldOptions } from "../../interfaces/select-field-options"
import { SelectField } from "./select-field"

export const DateFilter = () => {
	const monthLabel = "Mês"
	const monthPlaceholder = "Selecione um mês"
	const yearLabel = "Ano"
	const yearPlaceholder = "Selecione um ano"
	const { month, setMonth, year, setYear } = usePeriodFilterContext()

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
		<div className="flex items-center justify-between">
			<div className="grid grid-cols-2 gap-4">
				<SelectField
					label={monthLabel}
					placeholder={monthPlaceholder}
					options={MonthOptions}
					slotProps={{
						select: {
							value: String(month),
							onValueChange: (value) => setMonth(Number(value)),
						},
					}}
				/>

				<SelectField
					label={yearLabel}
					placeholder={yearPlaceholder}
					options={YearOptions}
					slotProps={{
						select: {
							value: String(year),
							onValueChange: (value) => setYear(Number(value)),
						},
					}}
				/>
			</div>
		</div>
	)
}
