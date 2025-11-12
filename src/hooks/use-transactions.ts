import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dayjs } from "dayjs";
import { useCallback, useMemo } from "react";
import { UseQueryKeys } from "../constants/use-query-keys.constant";
import { TransactionType } from "../transactions/constants/transaction-type";
import { Transaction } from "../transactions/entities/transaction";
import { transactionsService } from "../transactions/services/transactions-service-impl";

interface IUseTransactionProp {
	type?: TransactionType;
	startDate?: Dayjs;
	endDate?: Dayjs;
}
export function useTransactions(options?: IUseTransactionProp) {
	const queryClient = useQueryClient();
	const { type, endDate, startDate } = options || {};
	const queryKey = useMemo(() => [UseQueryKeys.TRANSACTIONS, type, startDate, endDate], [type, startDate, endDate]);

	const fetchFn = async () => {
		if (type) {
			return transactionsService.getByType(type);
		}

		if (startDate && endDate) {
			return transactionsService.getTransactionsByPeriod(startDate, endDate);
		}

		return transactionsService.getAll();
	};

	const updateFn = useCallback(
		async ({ saveInInstallments, transaction }: { transaction: Transaction; saveInInstallments: boolean }) => {
			if (transaction.id) {
				return transactionsService.update(transaction);
			}

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
			queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === queryKey[0] });
		},
	});

	const deleteMutation = useMutation({
		mutationKey: queryKey,
		mutationFn: (transaction: Transaction) => transactionsService.delete(transaction),
		onSuccess: async () => {
			queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === queryKey[0] });
		},
	});

	return { query, updateMutation, deleteMutation };
}
