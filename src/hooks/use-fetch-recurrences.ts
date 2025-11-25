import { useQuery } from "@tanstack/react-query"
import { Dayjs } from "dayjs"
import { useCallback, useMemo } from "react"
import { UseQueryKeys } from "../constants/use-query-keys"
import { recurrencesService } from "../recurrences/services/recurrences-service-impl"
import { TransactionType } from "../transactions/constants/transaction-type"

interface IUseFetchTransactionsOptions {
	type?: TransactionType
	startDate?: Dayjs
	endDate?: Dayjs
}

export function useFetchRecurrences(options: IUseFetchTransactionsOptions = {}) {
	const queryKey = useMemo(() => [UseQueryKeys.RECURRENCES, options], [options])

	const getFetchFn = useCallback(() => {
		const { type, startDate, endDate } = options
		if (type !== undefined) {
			return () => recurrencesService.getByType(type)
		}

		if (startDate && endDate) {
			return () => recurrencesService.getRecurrencesByPeriod(startDate, endDate)
		}

		return () => recurrencesService.getAll()
	}, [options])

	const query = useQuery({
		queryKey,
		queryFn: getFetchFn(),
	})

	return { query }
}
