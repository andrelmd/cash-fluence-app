import { useMutation } from "@tanstack/react-query"
import { useCallback } from "react"
import { UseQueryKeys } from "../constants/use-query-keys"
import { Transaction } from "../transactions/entities/transaction"
import { transactionsService } from "../transactions/services/transactions-service-impl"
import { useInvalidateAll } from "../utils/query-invalidation"

export function useDeleteTransaction() {
	const invalidateAllTransactions = useInvalidateAll(UseQueryKeys.TRANSACTIONS)

	const mutationFn = useCallback(async (transaction: Transaction) => {
		return transactionsService.delete(transaction)
	}, [])

	return useMutation({
		mutationFn,
		onSuccess: invalidateAllTransactions,
	})
}
