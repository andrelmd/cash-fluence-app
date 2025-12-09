import { useQuery } from "@tanstack/react-query"
import { Dayjs } from "dayjs"
import { useCallback, useMemo } from "react"
import { UseQueryKeys } from "../constants/use-query-keys"
import { TransactionType } from "../transactions/constants/transaction-type"
import { transactionsService } from "../transactions/services/transactions-service-impl"

interface IUseFetchTransactionsOptions {
	type?: TransactionType
	startDate?: Dayjs
	endDate?: Dayjs
}

export function useFetchTransactions(options: IUseFetchTransactionsOptions = {}) {
	const queryKey = useMemo(() => [UseQueryKeys.TRANSACTIONS, options], [options])

	const getFetchFn = useCallback(() => {
		const { type, startDate, endDate } = options
		if (type !== undefined) {
			return () => transactionsService.getByType(type)
		}

		if (startDate && endDate) {
			return () => transactionsService.getTransactionsByPeriod(startDate, endDate)
		}

		if (startDate) {
			return () =>
				transactionsService.getMany({
					where: {
						dueDate: {
							operator: ">=",
							value: startDate,
						},
					},
				})
		}
		if (endDate) {
			return () =>
				transactionsService.getMany({
					where: {
						dueDate: {
							operator: "<=",
							value: endDate,
						},
					},
				})
		}

		return () => transactionsService.getAll()
	}, [options])

	const query = useQuery({
		queryKey,
		queryFn: getFetchFn(),
	})

	return { ...query }
}
