import { useQuery } from "@tanstack/react-query"
import { useCallback, useMemo } from "react"
import { UseQueryKeys } from "../constants/use-query-keys"
import { planningsService } from "../plannings/services/plannings-service-impl"

export const useFetchPlannings = () => {
	const queryKey = useMemo(() => [UseQueryKeys.PLANNINGS], [])

	const getFetchFn = useCallback(() => {
		return async () => planningsService.getAll()
	}, [])

	return useQuery({
		queryKey,
		queryFn: getFetchFn(),
	})
}
