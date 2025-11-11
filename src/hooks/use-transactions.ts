import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { UseQueryKeys } from "../constants/use-query-keys.constant";
import { TransactionType } from "../transactions/constants/transaction-type";
import { Transaction } from "../transactions/entities/transaction";
import { transactionsService } from "../transactions/services/transactions-service-impl";

interface IUseTransactionProp {
	type: TransactionType;
}
export function useTransactions(options?: IUseTransactionProp) {
	const queryClient = useQueryClient();
	const { type } = options || {};
	const queryKey = useMemo(() => [UseQueryKeys.TRANSACTIONS, type], [type]);

	const fetchFn = useCallback(async () => {
		if (!type) return transactionsService.getAll();
		return transactionsService.getByType(type);
	}, [type]);

	const updateFn = useCallback(
		async ({ saveInInstallments, transaction }: { transaction: Transaction; saveInInstallments: boolean }) => {
			if (saveInInstallments) {
				return transactionsService.saveInInstallments(transaction);
			}
			return transactionsService.save(transaction);
		},
		[type],
	);

	const query = useQuery({
		queryKey,
		queryFn: fetchFn,
	});

	const updateMutation = useMutation({
		mutationKey: queryKey,
		mutationFn: updateFn,
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
