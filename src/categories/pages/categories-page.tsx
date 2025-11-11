import { useState } from "react";
import { ContentLayout } from "../../components/layouts/content-layout/content-layout";
import { Button } from "../../components/ui/button";
import { useCategories } from "../../hooks/use-categories";
import { CategoryCardList } from "../components/category-card-list";
import { CategoryForm } from "../components/category-form";
import { Category } from "../entities/Category";

export const Categories = () => {
	const { data, isFetching } = useCategories();
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | undefined>();

	const handleEdit = (id: number) => {
		const categoryToEdit = data?.find((category) => category.id === id);
		if (!categoryToEdit) return;

		setEditingCategory(categoryToEdit);
		setIsEditDialogOpen(true);
	};

	return (
		<ContentLayout isLoading={isFetching}>
			<div className="flex flex-1 flex-col gap-4 overflow-auto">
				<div className="flex justify-end">
					<CategoryForm open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
						<Button>Nova categoria</Button>
					</CategoryForm>
					<CategoryForm category={editingCategory} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
				</div>
				<CategoryCardList categories={data} onEdit={handleEdit} />
			</div>
		</ContentLayout>
	);
};
