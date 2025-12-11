import { relaunch } from "@tauri-apps/plugin-process"
import { check, Update } from "@tauri-apps/plugin-updater"
import { createContext, ReactNode, useCallback, useContext, useState } from "react"
import { Logger } from "../logger/logger.class"

interface UpdaterContextData {
	updateAvailable: boolean
	checking: boolean
	downloading: boolean
	progress: number
	totalSize: number
	updateMetadata: Update | null
	checkForUpdates: () => Promise<Update | null>
	installUpdate: () => Promise<void>
	error: string | null
}

const UpdaterContext = createContext<UpdaterContextData>({} as UpdaterContextData)

export const UpdaterProvider = ({ children }: { children: ReactNode }) => {
	const [updateMetadata, setUpdateMetadata] = useState<Update | null>(null)
	const [checking, setChecking] = useState(false)
	const [downloading, setDownloading] = useState(false)
	const [progress, setProgress] = useState(0)
	const [totalSize, setTotalSize] = useState(0)
	const [error, setError] = useState<string | null>(null)

	const checkForUpdates = useCallback(async () => {
		setChecking(true)
		setError(null)
		try {
			const update = await check()
			if (update) {
				setUpdateMetadata(update)
			} else {
				setUpdateMetadata(null)
			}
			return update
		} catch (err) {
			Logger.error(err)
			setError(err instanceof Error ? err.message : "Failed to check for updates")
			throw err
		} finally {
			setChecking(false)
		}
	}, [])

	const installUpdate = useCallback(async () => {
		if (!updateMetadata) return

		setDownloading(true)
		setError(null)
		let downloaded = 0
		let contentLength = 0

		try {
			await updateMetadata.downloadAndInstall((event) => {
				switch (event.event) {
					case "Started":
						contentLength = event.data.contentLength || 0
						setTotalSize(contentLength)
						break
					case "Progress":
						downloaded += event.data.chunkLength
						setProgress(downloaded)
						break
					case "Finished":
						break
				}
			})

			await relaunch()
		} catch (err) {
			Logger.error(err)
			setError(err instanceof Error ? err.message : "Failed to install update")
			throw err
		} finally {
			setDownloading(false)
		}
	}, [updateMetadata])

	return (
		<UpdaterContext.Provider
			value={{
				updateAvailable: !!updateMetadata,
				checking,
				downloading,
				progress,
				totalSize,
				updateMetadata,
				checkForUpdates,
				installUpdate,
				error,
			}}
		>
			{children}
		</UpdaterContext.Provider>
	)
}

export const useUpdater = () => useContext(UpdaterContext)
