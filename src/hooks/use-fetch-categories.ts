import { useQuery } from "@tanstack/react-query"
import { useCallback } from "react"
import { categoryService } from "../categories/services/category-service-impl"
import { UseQueryKeys } from "../constants/use-query-keys"

export function useFetchCategories() {
	const queryKey = [UseQueryKeys.CATEGORIES]

	const getFetchFn = useCallback(() => {
		return async () => categoryService.getAll()
	}, [])

	return useQuery({
		queryKey,
		queryFn: getFetchFn(),
	})
}
