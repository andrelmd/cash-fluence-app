import { useCallback, useMemo, useState } from "react";
import { ContentLayout } from "../../components/layouts/content-layout/content-layout";
import { Button } from "../../components/ui/button";
import { Spinner } from "../../components/ui/spinner";
import { useTransactions } from "../../hooks/use-transactions";
import { TransactionCardList } from "../components/transaction-card-list";
import { TransactionForm } from "../components/transaction-form";
import { Transaction } from "../entities/transaction";

export const Transactions = () => {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [transaction, setTransaction] = useState<Transaction | null>(null);

	const { query } = useTransactions();
	const { data, isLoading } = query;

	const handleOnEdit = useCallback((transaction: Transaction) => {
		setTransaction(transaction);
		setIsFormOpen(true);
	}, []);

	const content = useMemo(() => {
		if (!data) return <Spinner />;
		if (!data.length)
			return (
				<div className="flex flex-1 items-center justify-center">
					<p>Nenhuma transação encontrada</p>
				</div>
			);
		return <TransactionCardList transactions={data} onEdit={handleOnEdit} />;
	}, [data, handleOnEdit]);

	return (
		<ContentLayout isLoading={isLoading}>
			<div className="flex flex-1 flex-col gap-4 overflow-auto">
				<div className="flex justify-end">
					<Button onClick={() => setIsFormOpen(true)}>Criar nova transação</Button>
				</div>
				{content}
				<TransactionForm
					transaction={transaction}
					open={isFormOpen}
					onOpenChange={setIsFormOpen}
					onClose={() => setTransaction(null)}
				/>
			</div>
		</ContentLayout>
	);
};
