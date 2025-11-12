import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { ContentLayout } from "../../components/layouts/content-layout/content-layout";
import { Button } from "../../components/ui/button";
import { CardList } from "../../components/ui/card-list";
import { useTransactions } from "../../hooks/use-transactions";
import { TransactionCard } from "../components/transaction-card";
import { TransactionForm } from "../components/transaction-form";
import { Transaction } from "../entities/transaction";

export const Transactions = () => {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [transaction, setTransaction] = useState<Transaction | null>(null);

	const startDate = dayjs().startOf("month");
	const endDate = dayjs().endOf("month");
	const { query } = useTransactions({ startDate, endDate });
	const { data, isLoading } = query;

	const handleOnEdit = useCallback((transaction: Transaction) => {
		setTransaction(transaction);
		setIsFormOpen(true);
	}, []);

	const handleOnClose = useCallback(() => {
		setTransaction(null);
		setIsFormOpen(false);
	}, []);

	const handleOnOpen = useCallback(() => {
		setIsFormOpen(true);
	}, []);

	return (
		<ContentLayout isLoading={isLoading}>
			<div className="flex flex-1 flex-col gap-4 overflow-auto">
				<div className="flex justify-end">
					<Button onClick={handleOnOpen}>Criar nova transação</Button>
				</div>
				<CardList
					noContentText="Nenhuma transação encontrada"
					content={data}
					render={(item) => <TransactionCard transaction={item} key={item.id} onEdit={handleOnEdit} />}
				/>
				<TransactionForm transaction={transaction} open={isFormOpen} onOpenChange={setIsFormOpen} onClose={handleOnClose} />
			</div>
		</ContentLayout>
	);
};
