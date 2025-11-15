import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import dayjs from "dayjs"
import { AppLayout } from "./components/layouts/app-layout/app-layout"
import "./index.css"
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

	return (
		<QueryClientProvider client={queryClient}>
			<AppLayout />
		</QueryClientProvider>
	)
}

export default App
