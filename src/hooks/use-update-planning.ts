import { useMutation } from "@tanstack/react-query"
import { useCallback } from "react"
import { UseQueryKeys } from "../constants/use-query-keys"
import { Planning } from "../plannings/entities/planning"
import { planningsService } from "../plannings/services/plannings-service-impl"
import { useInvalidateAll } from "../utils/query-invalidation"

export const useUpdatePlanning = () => {
	const mutationFn = useCallback(async (data: Planning) => {
		if (data.id) {
			return planningsService.update(data)
		}
		return planningsService.save(data)
	}, [])

	return useMutation({
		mutationFn,
		onSuccess: useInvalidateAll(UseQueryKeys.PLANNINGS),
	})
}
