import { useMutation } from "@tanstack/react-query"
import { useCallback } from "react"
import { UseQueryKeys } from "../constants/use-query-keys"
import { Planning } from "../plannings/entities/planning"
import { planningsService } from "../plannings/services/plannings-service-impl"
import { useInvalidateAll } from "../utils/query-invalidation"

export const useDeletePlanning = () => {
	const invalidateAllPlannings = useInvalidateAll(UseQueryKeys.PLANNINGS)

	const mutationFn = useCallback(async (data: Planning) => {
		if (data.id) {
			return planningsService.delete(data)
		}
		return planningsService.save(data)
	}, [])

	return useMutation({
		mutationFn,
		onSuccess: invalidateAllPlannings,
	})
}
