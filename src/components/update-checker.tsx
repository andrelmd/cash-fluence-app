import { Update } from "@tauri-apps/plugin-updater"
import { useCallback, useEffect, useRef } from "react"
import { toast } from "sonner"
import { useUpdater } from "../contexts/updater-context"
import { Logger } from "../logger/logger.class"

const createUpdateAction = (onInstall: () => void) => ({
	label: "Atualizar",
	onClick: onInstall,
})

const handleManualUpdateCheck = async (checkForUpdatesFn: () => Promise<Update | null>, onInstall: () => void) => {
	const toastId = toast.loading("Verificando atualizações...")
	try {
		const updateInfo = await checkForUpdatesFn()

		if (updateInfo) {
			toast.success(`Nova versão disponível: ${updateInfo.version}`, {
				id: toastId,
				action: createUpdateAction(onInstall),
			})
		} else {
			toast.success("Você já está na versão mais recente", {
				id: toastId,
			})
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : "Erro ao verificar atualizações"
		toast.error(message, {
			id: toastId,
		})
	}
}

export const UpdateChecker = () => {
	const { checkForUpdates, installUpdate } = useUpdater()
	const hasChecked = useRef(false)

	const runSilentCheck = useCallback(async () => {
		try {
			const updateInfo = await checkForUpdates()
			if (updateInfo) {
				toast.info(`Nova versão disponível: ${updateInfo.version}`, {
					action: createUpdateAction(installUpdate),
				})
			}
		} catch (error) {
			Logger.error("Falha na verificação silenciosa de atualização:", error)
		}
	}, [checkForUpdates, installUpdate])

	const runManualCheck = useCallback(() => {
		handleManualUpdateCheck(checkForUpdates, installUpdate)
	}, [checkForUpdates, installUpdate])

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

	return null
}
