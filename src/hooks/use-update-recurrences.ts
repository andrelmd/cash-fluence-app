import { useMutation } from "@tanstack/react-query"
import { useCallback } from "react"
import { UseQueryKeys } from "../constants/use-query-keys"
import { Recurrence } from "../recurrences/entities/recurrence"
import { recurrencesService } from "../recurrences/services/recurrences-service-impl"
import { useInvalidateAll } from "../utils/query-invalidation"

export function useUpdateRecurrence() {
	const invalidateAllTransactions = useInvalidateAll(UseQueryKeys.RECURRENCES)

	const mutationFn = useCallback(async (recurrence: Recurrence) => {
		if (recurrence.id) {
			return recurrencesService.update(recurrence)
		}

		return recurrencesService.save(recurrence)
	}, [])

	return useMutation({
		mutationFn,
		onSuccess: invalidateAllTransactions,
	})
}
