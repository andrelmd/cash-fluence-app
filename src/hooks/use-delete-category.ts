import { useMutation } from "@tanstack/react-query"
import { Category } from "../categories/entities/Category"
import { categoryService } from "../categories/services/category-service-impl"
import { UseQueryKeys } from "../constants/use-query-keys"
import { useInvalidateAll } from "../utils/query-invalidation"

export function useDeleteCategory() {
	const invalidateAllCategories = useInvalidateAll(UseQueryKeys.TRANSACTIONS)

	return useMutation({
		mutationFn: (category: Category) => categoryService.delete(category),
		onSuccess: invalidateAllCategories,
	})
}
