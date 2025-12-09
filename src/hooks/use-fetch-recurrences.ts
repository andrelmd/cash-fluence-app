import { useQuery } from "@tanstack/react-query"
import { useCallback, useMemo } from "react"
import { UseQueryKeys } from "../constants/use-query-keys"
import { recurrencesService } from "../recurrences/services/recurrences-service-impl"
import { TransactionType } from "../transactions/constants/transaction-type"

interface IUseFetchTransactionsOptions {
	type?: TransactionType
}

export function useFetchRecurrences(options: IUseFetchTransactionsOptions = {}) {
	const queryKey = useMemo(() => [UseQueryKeys.RECURRENCES, options], [options])

	const getFetchFn = useCallback(() => {
		const { type } = options
		if (type !== undefined) {
			return () => recurrencesService.getByType(type)
		}

		return () => recurrencesService.getAll()
	}, [options])

	const query = useQuery({
		queryKey,
		queryFn: getFetchFn(),
	})

	return { ...query }
}
