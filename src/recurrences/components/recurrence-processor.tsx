import { useEffect } from "react"
import { toast } from "sonner"
import { lockService } from "../../lock/services/lock-service-impl"
import { Logger } from "../../logger/logger.class"
import { recurrenceProcessor } from "../services/recurrences-processor-impl"

export const RecurrenceProcessor = () => {
	useEffect(() => {
		const runRecurrenceProcessing = async () => {
			try {
				const hasLock = await lockService.acquireLock("recurrence_processor")

				if (!hasLock) {
					Logger.log(
						"Could not acquire lock for recurrence processing. Another instance may be running or already processed today."
					)
					return
				}

				const processingPromise = recurrenceProcessor.processRecurrences()

				toast.promise(processingPromise, {
					loading: "Processando recorrências...",
					success: "Recorrências processadas com sucesso!",
					error: "Erro ao processar recorrências",
				})
			} catch (error) {
				Logger.error("Could not acquire lock for recurrence processing", error)
			}
		}

		runRecurrenceProcessing()
	}, [])

	return null
}
