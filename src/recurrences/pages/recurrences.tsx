import { useCallback, useState } from "react"
import { Button } from "../../components/ui/button"
import { CardList } from "../../components/ui/card-list"
import { useFetchRecurrences } from "../../hooks/use-fetch-recurrences"
import { RecurrenceCard } from "../components/recurrence-card"
import { RecurrenceForm } from "../components/recurrence-form"
import { Recurrence } from "../entities/recurrence"

export const Recurrences = () => {
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [recurrence, setRecurrence] = useState<Recurrence | null>(null)

	const { data, isLoading } = useFetchRecurrences()

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
		<>
			<div className="flex flex-1 flex-col gap-4 overflow-auto">
				<div className="flex items-center justify-end">
					<Button onClick={handleOnOpen}>Criar nova recorrência</Button>
				</div>
				<div className="overflow-auto flex-1 flex p-4">
					<CardList
						noContentText="Nenhuma recorrência encontrada"
						data={data}
						isLoading={isLoading}
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
		</>
	)
}
