import { useQuery } from "@tanstack/react-query"
import { Dayjs } from "dayjs"
import { useCallback, useMemo } from "react"
import { UseQueryKeys } from "../constants/use-query-keys"
import { GreaterThanOrEqual, LessThanOrEqual } from "../database/operators/query-operators"
import { TransactionFilterType } from "../transactions/constants/transaction-filter-type"
import { TransactionType } from "../transactions/constants/transaction-type"
import { transactionsService } from "../transactions/services/transactions-service-impl"

interface IUseFetchTransactionsOptions {
	type?: TransactionType
	startDate?: Dayjs
	endDate?: Dayjs
	installmentCode?: string
	filterType?: TransactionFilterType
}

export function useFetchTransactions(options: IUseFetchTransactionsOptions = {}) {
	const queryKey = useMemo(() => [UseQueryKeys.TRANSACTIONS, options], [options])

	const getFetchFn = useCallback(() => {
		const { type, startDate, endDate, installmentCode, filterType = TransactionFilterType.ALL } = options
		if (type !== undefined) {
			return () => transactionsService.getByType(type)
		}

		if (startDate && endDate) {
			switch (filterType) {
				case TransactionFilterType.DUE_DATE:
					return () => transactionsService.getTransactionsByDueDate(startDate, endDate)
				case TransactionFilterType.CREATE_DATE:
					return () => transactionsService.getTransactionByCreationDate(startDate, endDate)
				default:
					return () => transactionsService.getTransactionsByDueDateOrCreationDate(startDate, endDate)
			}
		}

		if (startDate) {
			return () =>
				transactionsService.getMany({
					where: {
						dueDate: GreaterThanOrEqual(startDate),
					},
				})
		}
		if (endDate) {
			return () =>
				transactionsService.getMany({
					where: {
						dueDate: LessThanOrEqual(endDate),
					},
				})
		}

		if (installmentCode) {
			return () => transactionsService.getByInstallmentCode(installmentCode)
		}

		return () => transactionsService.getAll()
	}, [options])

	const query = useQuery({
		queryKey,
		queryFn: getFetchFn(),
	})

	return { ...query }
}
