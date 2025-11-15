import { Button } from "@/components/ui/button"
import dayjs from "dayjs"
import { useMemo } from "react"
import { Dialog, DialogClose, DialogContent, DialogFooter } from "../../components/ui/dialog"
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from "../../components/ui/field"
import { SelectField } from "../../components/ui/select-field"
import { useFetchFirstYearTransaction } from "../../hooks/use-fetch-first-year-transaction"
import { ISelectFieldOptions } from "../../interfaces/select-field-options"

interface IPlanningFilterProps {
	open: boolean
	onOpenChange: (value: boolean) => void
	month: number
	setMoth: (value: number) => void
	year: number
	setYear: (value: number) => void
}

export const PlanningFilterDialog = ({ open, onOpenChange, month, setMoth, year, setYear }: IPlanningFilterProps) => {
	const monthLabel = "Mês"
	const monthPlaceholder = "Selecione um mês"
	const MonthOptions: ISelectFieldOptions[] = useMemo(
		() =>
			Array.from({ length: 12 }, (_, index) => ({
				label: dayjs().month(index).format("MMMM"),
				value: String(index),
			})),
		[]
	)

	const { data: firstYear } = useFetchFirstYearTransaction()

	const yearLabel = "Ano"
	const yearPlaceholder = "Selecione um ano"
	const YearOptions: ISelectFieldOptions[] = useMemo(() => {
		const currentYear = dayjs().year()

		if (!firstYear)
			return [
				{
					label: String(currentYear),
					value: String(currentYear),
				},
			]

		return Array.from({ length: Math.max(currentYear - firstYear, 1) }, (_, index) => ({
			label: String(currentYear - index),
			value: String(currentYear - index),
		}))
	}, [firstYear])

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<FieldSet>
					<FieldLegend>Filtros</FieldLegend>
					<FieldDescription>Filtre seus planejamentos por mês e ano.</FieldDescription>
					<FieldGroup>
						<div className="grid grid-cols-2 gap-4">
							<SelectField
								label={monthLabel}
								placeholder={monthPlaceholder}
								options={MonthOptions}
								slotProps={{
									select: {
										value: String(month),
										onValueChange: (value) => setMoth(Number(value)),
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
					</FieldGroup>
				</FieldSet>
				<DialogFooter>
					<div className="flex justify-end">
						<DialogClose asChild>
							<Button type="button">Fechar</Button>
						</DialogClose>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
