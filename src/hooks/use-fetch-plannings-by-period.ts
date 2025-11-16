import { useQuery } from "@tanstack/react-query"
import { useCallback, useMemo } from "react"
import { UseQueryKeys } from "../constants/use-query-keys"
import { planningsService } from "../plannings/services/plannings-service-impl"

interface IuseFetchPlanningsByPeriodProps {
	month: number
	year: number
}

export const useFetchPlanningsByPeriod = (options: IuseFetchPlanningsByPeriodProps) => {
	const { month, year } = options

	const queryKey = useMemo(() => [UseQueryKeys.PLANNINGS, options], [options])

	const getFetchFn = useCallback(() => {
		return async () => planningsService.getByDate(month, year)
	}, [options])

	return useQuery({
		queryKey,
		queryFn: getFetchFn(),
	})
}
