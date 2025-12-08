import dayjs from "dayjs"
import { useCallback, useState } from "react"
import { ContentLayout } from "../../components/layouts/content-layout/content-layout"
import { Button } from "../../components/ui/button"
import { CardList } from "../../components/ui/card-list"
import { DateFilter } from "../../components/ui/date-filter"
import { useFetchPlanningsByPeriod } from "../../hooks/use-fetch-plannings-by-period"
import { PlanningCard } from "../components/planning-card"
import { CategoryForm } from "../components/planning-form"
import { Planning } from "../entities/planning"

export const Plannings = () => {
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [planning, setPlanning] = useState<Planning | null>(null)
	const [month, setMoth] = useState(dayjs().month())
	const [year, setYear] = useState(dayjs().year())

	const { data, isLoading } = useFetchPlanningsByPeriod({ month, year })

	const handleOnEdit = useCallback((planning: Planning) => {
		setPlanning(planning)
		setIsFormOpen(true)
	}, [])

	const handleOnClose = useCallback(() => {
		setPlanning(null)
		setIsFormOpen(false)
	}, [])

	const handleOnOpen = useCallback(() => {
		setIsFormOpen(true)
	}, [])

	return (
		<ContentLayout isLoading={isLoading}>
			<div className="flex flex-1 flex-col gap-4 overflow-auto">
				<div className="flex items-center justify-between">
					<DateFilter month={month} setMoth={setMoth} year={year} setYear={setYear} />

					<Button onClick={handleOnOpen}>Novo planejamento</Button>
				</div>
				<div className="overflow-auto flex-1 flex p-4">
					<CardList
						data={data}
						noContentText="Nenhum planejamento encontrado"
						render={(item) => <PlanningCard plan={item} key={item.id} onEdit={handleOnEdit} />}
					/>
				</div>
			</div>
			<CategoryForm planning={planning} open={isFormOpen} onOpenChange={setIsFormOpen} onClose={handleOnClose} />
		</ContentLayout>
	)
}
