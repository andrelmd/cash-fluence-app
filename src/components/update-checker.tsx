import { useCallback, useEffect, useId, useRef } from "react"
import { toast } from "sonner"
import { useUpdater } from "../contexts/updater-context"
import { Logger } from "../logger/logger.class"

export const UpdateChecker = () => {
	const { checkForUpdates, installUpdate, updateAvailable } = useUpdater()
	const updateToastId = useId()
	const hasChecked = useRef(false)
	const hasShowedToast = useRef(false)

	const runSilentCheck = useCallback(async () => {
		try {
			const updateInfo = await checkForUpdates()
			if (updateInfo) {
				toast.info(`Nova versão disponível: ${updateInfo.version}`)
			}
		} catch (error) {
			Logger.error("Falha na verificação silenciosa de atualização:", error)
		}
	}, [checkForUpdates])

	const runManualCheck = useCallback(async () => {
		toast.promise(checkForUpdates(), {
			id: updateToastId,
			loading: "Verificando atualização",
			success: "Atualização verificada com sucesso",
			error: "Erro ao verificar atualização",
		}) as string | number
	}, [checkForUpdates])

	useEffect(() => {
		if (!hasChecked.current) {
			runManualCheck()
			hasChecked.current = true
		}
	}, [runManualCheck])

	useEffect(() => {
		const intervalId = setInterval(runSilentCheck, 1000 * 60 * 60)
		return () => clearInterval(intervalId)
	}, [runSilentCheck])

	useEffect(() => {
		if (!hasShowedToast.current && updateAvailable) {
			hasShowedToast.current = true
			toast.info("Nova versão disponível!", {
				id: updateToastId,
				action: {
					label: "Atualizar",
					onClick: () => {
						toast.promise(installUpdate(), {
							id: updateToastId,
							loading: "Baixando atualização",
							success: "Atualização baixada com sucesso",
							error: "Erro ao baixar atualização",
						})
					},
				},
			})
		}
	}, [updateAvailable, installUpdate, updateToastId])

	return null
}
