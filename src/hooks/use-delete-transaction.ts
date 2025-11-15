import { useMutation } from "@tanstack/react-query"
import { UseQueryKeys } from "../constants/use-query-keys"
import { Transaction } from "../transactions/entities/transaction"
import { transactionsService } from "../transactions/services/transactions-service-impl"
import { useInvalidateAll } from "../utils/query-invalidation"

export function useDeleteTransaction() {
	const invalidateAllTransactions = useInvalidateAll(UseQueryKeys.TRANSACTIONS)

	return useMutation({
		mutationFn: (transaction: Transaction) => transactionsService.delete(transaction),
		onSuccess: invalidateAllTransactions,
	})
}
