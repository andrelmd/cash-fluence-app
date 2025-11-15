import { useMutation } from "@tanstack/react-query"
import { useCallback } from "react"
import { UseQueryKeys } from "../constants/use-query-keys"
import { Transaction } from "../transactions/entities/transaction"
import { transactionsService } from "../transactions/services/transactions-service-impl"
import { useInvalidateAll } from "../utils/query-invalidation"

export function useUpdateTransaction() {
	const invalidateAllTransactions = useInvalidateAll(UseQueryKeys.TRANSACTIONS)

	const mutationFn = useCallback(
		async ({ saveInInstallments, transaction }: { transaction: Transaction; saveInInstallments: boolean }) => {
			if (transaction.id) {
				return transactionsService.update(transaction)
			}

			return saveInInstallments
				? transactionsService.saveInInstallments(transaction)
				: transactionsService.save(transaction)
		},
		[]
	)

	return useMutation({
		mutationFn,
		onSuccess: invalidateAllTransactions,
	})
}
