import { useQuery } from "@tanstack/react-query"
import { categoryService } from "../categories/services/category-service-impl"
import { UseQueryKeys } from "../constants/use-query-keys"

export function useFetchOneCategory(id: number) {
	const queryKey = [UseQueryKeys.CATEGORIES, id]

	return useQuery({
		queryKey,
		queryFn: () => categoryService.getById(id),
	})
}
