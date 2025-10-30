import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TransactionType } from "../constants/transaction-type";
import { deleteTransaction } from "../services/delete-transaction.service";
import { getTransactions } from "../services/get-transactions.service";
import { saveTransactions } from "../services/save-transaction.service";

interface IUseTransactionProp {
	type?: TransactionType;
}
export function useTransaction(options?: IUseTransactionProp) {
	const queryClient = useQueryClient();
	const { type } = options || {};
	const key = ["transactions", type];

	const query = useQuery({
		queryKey: key,
		queryFn: () => getTransactions(type),
	});

	const updateMutation = useMutation({
		mutationKey: key,
		mutationFn: saveTransactions,
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});

	const deleteMutation = useMutation({
		mutationKey: key,
		mutationFn: deleteTransaction,
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});

	return { query, updateMutation, deleteMutation };
}
