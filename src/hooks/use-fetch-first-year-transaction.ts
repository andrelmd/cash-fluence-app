import { useQuery } from "@tanstack/react-query"
import { transactionsService } from "../transactions/services/transactions-service-impl"

export const useFetchFirstYearTransaction = () => {
	return useQuery({
		queryKey: ["firstYearTransaction"],
		queryFn: async () => transactionsService.getFirstYear(),
	})
}
