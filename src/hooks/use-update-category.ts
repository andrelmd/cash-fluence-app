import { useMutation } from "@tanstack/react-query"
import { useCallback } from "react"
import { Category } from "../categories/entities/Category"
import { categoryService } from "../categories/services/category-service-impl"
import { UseQueryKeys } from "../constants/use-query-keys"
import { useInvalidateAll } from "../utils/query-invalidation"

export function useUpdateCategory() {
	const invalidateAllCategories = useInvalidateAll(UseQueryKeys.CATEGORIES)

	const mutationFn = useCallback(async (data: Category) => {
		if (data.id) {
			return categoryService.update(data)
		}
		return categoryService.save(data)
	}, [])

	return useMutation({
		mutationFn,
		onSuccess: invalidateAllCategories,
	})
}
