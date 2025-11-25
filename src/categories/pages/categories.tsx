import { useCallback, useState } from "react"
import { ContentLayout } from "../../components/layouts/content-layout/content-layout"
import { Button } from "../../components/ui/button"
import { CardList } from "../../components/ui/card-list"
import { useFetchCategories } from "../../hooks/use-fetch-categories"
import { CategoryCard } from "../components/category-card"
import { CategoryForm } from "../components/category-form"
import { Category } from "../entities/Category"

export const Categories = () => {
	const { data, isLoading } = useFetchCategories()
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [category, setCategory] = useState<Category | null>(null)

	const handleOnEdit = useCallback((category: Category) => {
		setCategory(category)
		setIsFormOpen(true)
	}, [])

	const handleOnClose = useCallback(() => {
		setCategory(null)
		setIsFormOpen(false)
	}, [])

	const handleOnOpen = useCallback(() => {
		setIsFormOpen(true)
	}, [])

	return (
		<ContentLayout isLoading={isLoading}>
			<div className="flex flex-1 flex-col gap-4 overflow-auto">
				<div className="flex justify-end">
					<Button onClick={handleOnOpen}>Nova categoria</Button>
				</div>
				<div className="overflow-auto flex-1 flex p-4">
					<CardList
						data={data}
						noContentText="Nenhuma categoria encontrada"
						render={(item) => <CategoryCard category={item} key={item.id} onEdit={handleOnEdit} />}
					/>
				</div>
			</div>
			<CategoryForm category={category} open={isFormOpen} onOpenChange={setIsFormOpen} onClose={handleOnClose} />
		</ContentLayout>
	)
}
