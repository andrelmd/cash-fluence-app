import { useMutation } from "@tanstack/react-query"
import { useCallback } from "react"
import { UseQueryKeys } from "../constants/use-query-keys"
import { Recurrence } from "../recurrences/entities/recurrence"
import { recurrencesService } from "../recurrences/services/recurrences-service-impl"
import { useInvalidateAll } from "../utils/query-invalidation"

export function useDeleteRecurrence() {
	const invalidateAllTransactions = useInvalidateAll(UseQueryKeys.RECURRENCES)

	const mutationFn = useCallback(async (recurrence: Recurrence) => {
		return recurrencesService.delete(recurrence)
	}, [])

	return useMutation({
		mutationFn,
		onSuccess: invalidateAllTransactions,
	})
}
