import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useEffect } from "react"
import { toast } from "sonner"
import { AppLayout } from "./components/layouts/app-layout/app-layout"
import { UpdateChecker } from "./components/update-checker"
import { UpdaterProvider } from "./contexts/updater-context"
import "./index.css"
import { lockService } from "./lock/services/lock-service-impl"
import { Logger } from "./logger/logger.class"
import { recurrenceProcessor } from "./recurrences/services/recurrences-processor-impl"
import("dayjs/locale/pt-br")

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
})

function App() {
	dayjs.locale("pt-br")
	dayjs.extend(relativeTime)

	useEffect(() => {
		const process = async () => {
			const lock = await lockService.acquireLock("recurrence_processor")
			if (!lock) {
				Logger.log("Could not acquire lock")
				return
			}

			await recurrenceProcessor.processRecurrences()
		}
		toast.promise(() => process(), {
			loading: "Processando recorrências...",
			success: "Recorrências processadas com sucesso",
			error: "Erro ao processar recorrências",
		})
	}, [])

	return (
		<UpdaterProvider>
			<UpdateChecker />
			<QueryClientProvider client={queryClient}>
				<AppLayout />
			</QueryClientProvider>
		</UpdaterProvider>
	)
}

export default App
