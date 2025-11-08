import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppLayout } from "./components/layouts/app-layout/app-layout";
import "./index.css";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AppLayout />
		</QueryClientProvider>
	);
}

export default App;
