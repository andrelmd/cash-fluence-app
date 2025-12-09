import { useQueryClient } from "@tanstack/react-query"
import { UseQueryKeys } from "../constants/use-query-keys"

export const useInvalidateAll = (cacheKey: UseQueryKeys) => {
	const queryClient = useQueryClient()
	return () =>
		queryClient.invalidateQueries({
			queryKey: [cacheKey],
		})
}
