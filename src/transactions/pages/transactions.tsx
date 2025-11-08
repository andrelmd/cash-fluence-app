import { useMemo } from "react";
import { ContentLayout } from "../../components/layouts/content-layout/content-layout";
import { Spinner } from "../../components/ui/spinner";
import { TransactionCard } from "../../components/ui/transaction-card";
import { useTransactions } from "../../hooks/use-transactions";

export const Transactions = () => {
	const { query } = useTransactions();
	const { data, isFetching } = query;

	const content = useMemo(() => {
		if (!data) return <Spinner />;
		if (!data.length) return <p>Nenhuma transação encontrada</p>;
		return data.map((transaction) => {
			return <TransactionCard key={transaction.id} transaction={transaction} />;
		});
	}, [data]);

	return <ContentLayout isLoading={isFetching}>{content}</ContentLayout>;
};
