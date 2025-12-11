import { useEffect } from "react"
import { toast } from "sonner"
import { useUpdater } from "../contexts/updater-context"

export const UpdateChecker = () => {
	const { checkForUpdates, installUpdate } = useUpdater()

	useEffect(() => {
		const check = async (silent: boolean) => {
			const promise = checkForUpdates()
			if (!silent) {
				toast.promise(promise, {
					loading: "Verificando atualizações...",
					success: (data) => {
						if (data) {
							return `Nova versão disponível: ${data.version}`
						}
						return "Você já está na versão mais recente"
					},
					error: (err) => (err instanceof Error ? err.message : "Erro ao verificar atualizações"),
					action: {
						label: "Atualizar",
						onClick: installUpdate,
					},
				})
			} else {
				try {
					const data = await promise
					if (data) {
						toast.info(`Nova versão disponível: ${data.version}`)
					}
				} catch {}
			}
		}

		check(false)

		const interval = setInterval(
			() => {
				check(true)
			},
			// 1000 * 60 * 60
			5 * 1000
		)

		return () => clearInterval(interval)
	}, [checkForUpdates])

	return null
}
