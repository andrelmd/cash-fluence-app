import dayjs from "dayjs"
import { useCallback, useMemo, useState } from "react"
import { ContentLayout } from "../../components/layouts/content-layout/content-layout"
import { Button } from "../../components/ui/button"
import { CardList } from "../../components/ui/card-list"
import { DateFilterDialog } from "../../components/ui/date-filter-dialog"
import { useFetchRecurrences } from "../../hooks/use-fetch-recurrences"
import { RecurrenceCard } from "../components/recurrence-card"
import { RecurrenceForm } from "../components/recurrence-form"
import { Recurrence } from "../entities/recurrence"

export const Recurrences = () => {
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [recurrence, setRecurrence] = useState<Recurrence | null>(null)
	const [filterDialogIsOpen, setFilterDialogIsOpen] = useState(false)
	const [month, setMoth] = useState(dayjs().month())
	const [year, setYear] = useState(dayjs().year())

	const date = useMemo(() => dayjs().year(year).month(month), [month, year])
	const startDate = useMemo(() => date.startOf("month"), [date])
	const endDate = useMemo(() => date.endOf("month"), [date])

	const { query } = useFetchRecurrences({ startDate, endDate })
	const { data, isLoading } = query

	const handleOnEdit = useCallback((recurrence: Recurrence) => {
		setRecurrence(recurrence)
		setIsFormOpen(true)
	}, [])

	const handleOnClose = useCallback(() => {
		setRecurrence(null)
		setIsFormOpen(false)
	}, [])

	const handleOnOpen = useCallback(() => {
		setIsFormOpen(true)
	}, [])

	return (
		<ContentLayout isLoading={isLoading}>
			<div className="flex flex-1 flex-col gap-4 overflow-auto">
				<div className="flex justify-between">
					<Button variant={"secondary"} onClick={() => setFilterDialogIsOpen(true)}>
						Filtrar
					</Button>
					<Button onClick={handleOnOpen}>Criar nova recorrência</Button>
				</div>
				<div className="overflow-auto flex-1 flex p-4">
					<CardList
						noContentText="Nenhuma recorrência encontrada"
						data={data}
						render={(item) => <RecurrenceCard recurrence={item} key={item.id} onEdit={handleOnEdit} />}
					/>
				</div>
			</div>
			<RecurrenceForm
				recurrence={recurrence}
				open={isFormOpen}
				onOpenChange={setIsFormOpen}
				onClose={handleOnClose}
			/>
			<DateFilterDialog
				month={month}
				onOpenChange={setFilterDialogIsOpen}
				setMoth={setMoth}
				year={year}
				setYear={setYear}
				open={filterDialogIsOpen}
			/>
		</ContentLayout>
	)
}
