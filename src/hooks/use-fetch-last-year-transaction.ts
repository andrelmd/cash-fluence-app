import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { UseQueryKeys } from "../constants/use-query-keys"
import { transactionsService } from "../transactions/services/transactions-service-impl"

export const useFetchLastYearTransaction = () => {
	const queryKey = useMemo(() => [UseQueryKeys.LAST_YEAR_TRANSACTION], [])

	return useQuery({
		queryKey,
		queryFn: async () => transactionsService.getLastYear(),
	})
}
