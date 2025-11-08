import { useMemo } from "react";
import { Spinner } from "../../components/ui/spinner";
import { Category } from "../entities/Category";
import { CategoryCard } from "./category-card";

interface ICategoryCardList {
	categories?: Category[];
	onEdit?: (id: number) => void;
	onDelete?: (id: number) => void;
}

export const CategoryCardList = ({ categories, onDelete, onEdit }: ICategoryCardList) => {
	const handleOnEdit = (id: number) => {
		onEdit?.(id);
	};

	const handleOnDelete = (id: number) => {
		onDelete?.(id);
	};

	const content = useMemo(() => {
		if (!categories) return <Spinner />;
		if (!categories.length) return <p>Nenhuma categoria encontrada</p>;
		return categories.map((category) => {
			return <CategoryCard key={category.id} category={category} onEdit={handleOnEdit} onDelete={handleOnDelete} />;
		});
	}, [categories]);

	return <div className="flex flex-col gap-4">{content}</div>;
};
