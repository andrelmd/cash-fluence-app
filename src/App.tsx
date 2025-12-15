import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { AppLayout } from "./components/layouts/app-layout/app-layout"
import { UpdateChecker } from "./components/update-checker"
import { UpdaterProvider } from "./contexts/updater-context"
import "./index.css"
import { RecurrenceProcessor } from "./recurrences/components/recurrence-processor"
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

	return (
		<UpdaterProvider>
			<RecurrenceProcessor />
			<QueryClientProvider client={queryClient}>
				<AppLayout />
				<UpdateChecker />
			</QueryClientProvider>
		</UpdaterProvider>
	)
}

export default App
