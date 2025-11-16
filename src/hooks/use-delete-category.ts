import { useMutation } from "@tanstack/react-query"
import { useCallback } from "react"
import { Category } from "../categories/entities/Category"
import { categoryService } from "../categories/services/category-service-impl"
import { UseQueryKeys } from "../constants/use-query-keys"
import { useInvalidateAll } from "../utils/query-invalidation"

export function useDeleteCategory() {
	const invalidateAllCategories = useInvalidateAll(UseQueryKeys.CATEGORIES)

	const mutationFn = useCallback(async (category: Category) => {
		return categoryService.delete(category)
	}, [])

	return useMutation({
		mutationFn,
		onSuccess: invalidateAllCategories,
	})
}
