import { Transaction } from "../entities/transaction";
import { TransactionCard } from "./transaction-card";

interface ITransactionCardProps {
	transactions: Transaction[];
	onEdit?: (transaction: Transaction) => void;
}

export const TransactionCardList = ({ transactions, onEdit }: ITransactionCardProps) => {
	return (
		<div className="flex flex-1 flex-col gap-4 overflow-auto">
			{transactions.map((transaction) => {
				return <TransactionCard key={transaction.id} transaction={transaction} onEdit={onEdit} />;
			})}
		</div>
	);
};
