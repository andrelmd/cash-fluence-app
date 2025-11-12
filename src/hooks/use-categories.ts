import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Category } from "../categories/entities/Category";
import { categoryService } from "../categories/services/category-service-impl";
import { UseQueryKeys } from "../constants/use-query-keys.constant";

export function useCategories() {
	const queryKey = [UseQueryKeys.CATEGORIES];
	const queryClient = useQueryClient();

	const updateMutationFn = async (data: Category) => {
		if (data.id) {
			return categoryService.update(data);
		}
		return categoryService.save(data);
	};

	const { data, isError, isFetching, isLoading } = useQuery({
		queryKey,
		queryFn: () => categoryService.getAll(),
	});

	const { mutateAsync: updateFn, isPending: isUpdating } = useMutation({
		mutationKey: queryKey,
		mutationFn: updateMutationFn,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
	});

	const { mutateAsync: deleteFn, isPending: isDeleting } = useMutation({
		mutationKey: queryKey,
		mutationFn: (category: Category) => categoryService.delete(category),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
	});

	return {
		data,
		isFetching,
		isLoading,
		isError,
		updateFn,
		isUpdating,
		deleteFn,
		isDeleting,
	};
}
