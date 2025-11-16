import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { categoryService } from "../categories/services/category-service-impl"
import { UseQueryKeys } from "../constants/use-query-keys"

export function useFetchOneCategory(id: number) {
	const queryKey = useMemo(() => [UseQueryKeys.CATEGORIES, { id }], [id])

	return useQuery({
		queryKey,
		queryFn: () => categoryService.getById(id),
	})
}
