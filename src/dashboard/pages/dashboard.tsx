import { useMemo } from "react";
import { ContentLayout } from "../../components/layouts/content-layout/content-layout";
import { BalanceCard } from "../../components/ui/balance-card";
import { sumTransactionsByType } from "../../helpers/transaction-calculations";
import { useTransactions } from "../../hooks/use-transactions";
import { TransactionType } from "../../transactions/constants/transaction-type";

export const Dashboard = () => {
	const { query } = useTransactions();
	const { data, isFetching } = query;

	const incomeSum = useMemo(() => sumTransactionsByType(data ?? [], TransactionType.INCOME), [data]);
	const expenseSum = useMemo(() => sumTransactionsByType(data ?? [], TransactionType.EXPENSE), [data]);
	const balance = useMemo(() => incomeSum - expenseSum, [incomeSum, expenseSum]);

	return (
		<ContentLayout isLoading={isFetching}>
			<div>
				<BalanceCard type={TransactionType.INCOME} amount={incomeSum} />
				<BalanceCard type={TransactionType.EXPENSE} amount={expenseSum} />
				<BalanceCard type={null} amount={balance} />
			</div>
		</ContentLayout>
	);
};
