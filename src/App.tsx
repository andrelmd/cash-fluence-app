import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useEffect } from "react"
import { AppLayout } from "./components/layouts/app-layout/app-layout"
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

	useEffect(() => {
		const process = async () => {
			const lock = await lockService.acquireLock("recurrence_processor")
			if (!lock) {
				Logger.log("Could not acquire lock")
				return
			}

			await recurrenceProcessor.processRecurrences()
		}
		process()
	}, [])

	return (
		<QueryClientProvider client={queryClient}>
			<AppLayout />
		</QueryClientProvider>
	)
}

export default App
