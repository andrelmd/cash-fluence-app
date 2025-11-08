import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { UseQueryKeys } from "../constants/use-query-keys.constant";
import { TransactionType } from "../transactions/constants/transaction-type";
import { Transaction } from "../transactions/entities/transaction";
import { transactionsService } from "../transactions/services/transactions.service";

interface IUseTransactionProp {
	type: TransactionType;
}
export function useTransactions(options?: IUseTransactionProp) {
	const queryClient = useQueryClient();
	const { type } = options || {};
	const queryKey = [UseQueryKeys.TRANSACTIONS, type];

	const fetchFn = useCallback(async () => {
		if (!type) return transactionsService.getAll();
		return transactionsService.getByType(type);
	}, [type]);

	const query = useQuery({
		queryKey,
		queryFn: fetchFn,
	});

	const updateMutation = useMutation({
		mutationKey: queryKey,
		mutationFn: (data: Transaction) => transactionsService.save(data),
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey });
		},
	});

	const deleteMutation = useMutation({
		mutationKey: queryKey,
		mutationFn: (id: number) => transactionsService.delete(id),
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey });
		},
	});

	return { query, updateMutation, deleteMutation };
}
